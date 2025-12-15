// composables/useArticles.ts
import type { Article } from '~/types'

/**
 * 文章数据获取 composable
 */
export const useArticles = () => {
  /**
   * 获取所有已发布文章
   * @param limit - 限制返回数量
   */
  const getAllArticles = async (limit?: number) => {
    let query = queryContent<Article>('articles')
      .where({ published: { $ne: false } })
      .sort({ date: -1 })

    if (limit) {
      query = query.limit(limit)
    }

    return await query.find()
  }

  /**
   * 获取单篇文章
   * @param slug - 文章 slug
   */
  const getArticleBySlug = async (slug: string) => {
    return await queryContent<Article>('articles', slug).findOne()
  }

  /**
   * 获取分页文章列表
   * @param page - 页码
   * @param perPage - 每页数量
   */
  const getArticlesPaginated = async (page: number = 1, perPage: number = 8) => {
    const skip = (page - 1) * perPage

    const [articles, total] = await Promise.all([
      queryContent<Article>('articles')
        .where({ published: { $ne: false } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(perPage)
        .find(),
      queryContent<Article>('articles')
        .where({ published: { $ne: false } })
        .count(),
    ])

    const totalPages = Math.ceil(total / perPage)

    return {
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        perPage,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }

  /**
   * 按分类获取文章
   * @param category - 分类名称
   */
  const getArticlesByCategory = async (category: string) => {
    return await queryContent<Article>('articles')
      .where({
        published: { $ne: false },
        category: { $eq: category },
      })
      .sort({ date: -1 })
      .find()
  }

  /**
   * 获取所有分类
   */
  const getAllCategories = async () => {
    const articles = await queryContent<Article>('articles')
      .where({ published: { $ne: false } })
      .only(['category'])
      .find()

    const categories = [...new Set(articles.map(a => a.category))]
    return categories.filter(Boolean)
  }

  /**
   * 获取文章统计信息
   */
  const getArticleStats = async () => {
    const articles = await queryContent<Article>('articles')
      .where({ published: { $ne: false } })
      .find()

    return {
      total: articles.length,
      categories: [...new Set(articles.map(a => a.category))].length,
    }
  }

  /**
   * 获取相邻文章（上一篇/下一篇）
   * @param currentPath - 当前文章路径
   */
  const getAdjacentArticles = async (currentPath: string) => {
    const articles = await queryContent<Article>('articles')
      .where({ published: { $ne: false } })
      .sort({ date: -1 })
      .only(['_path', 'title'])
      .find()

    const currentIndex = articles.findIndex(a => a._path === currentPath)

    return {
      prev: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
      next: currentIndex > 0 ? articles[currentIndex - 1] : null,
    }
  }

  return {
    getAllArticles,
    getArticleBySlug,
    getArticlesPaginated,
    getArticlesByCategory,
    getAllCategories,
    getArticleStats,
    getAdjacentArticles,
  }
}
