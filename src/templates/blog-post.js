import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'

import * as Elements from '../components/elements'
import { Layout } from '../layout'
import { Head } from '../components/head'
import { PostTitle } from '../components/post-title'
import { PostDate } from '../components/post-date'
import { PostContainer } from '../components/post-container'
import { Bio } from '../components/bio'
import { PostNavigator } from '../components/post-navigator'
import { Disqus } from '../components/disqus'
import { Utterances } from '../components/utterances'
import { TableOfContents } from '../components/table-of-content'
import * as ScrollManager from '../utils/scroll'

import '../styles/code.scss'
import 'katex/dist/katex.min.css'

export default ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init()
    return () => ScrollManager.destroy()
  }, [])

  const post = data.markdownRemark
  const metaData = data.site.siteMetadata
  const { title, comment, siteUrl, author, sponsor } = metaData
  const { disqusShortName, utterances } = comment
  const { title: postTitle, date } = post.frontmatter
  const [currentHeaderUrl, setCurrentHeaderUrl] = useState(undefined)
  const tocItems = data.markdownRemark.tableOfContents
  const isTOCVisible = tocItems?.length > 0
  const HEADER_OFFSET_Y = 100

  useEffect(() => {
    const handleScroll = () => {
      let aboveHeaderUrl
      const currentOffsetY = window.pageYOffset
      const headerElements = document.querySelectorAll('.anchor-header')
      for (const elem of headerElements) {
        const { top } = elem.getBoundingClientRect()
        const elemTop = top + currentOffsetY
        const isLast = elem === headerElements[headerElements.length - 1]
        if (currentOffsetY < elemTop - HEADER_OFFSET_Y) {
          aboveHeaderUrl &&
            setCurrentHeaderUrl(aboveHeaderUrl.split(location.origin)[1])
          !aboveHeaderUrl && setCurrentHeaderUrl(undefined)
          break
        } else {
          isLast && setCurrentHeaderUrl(elem.href.split(location.origin)[1])
          !isLast && (aboveHeaderUrl = elem.href)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <Layout location={location} title={title}>
      <Head title={postTitle} description={post.excerpt} />
      <PostTitle title={postTitle} />
      <PostDate date={date} />
      <PostContainer html={post.html} />
      {isTOCVisible && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            right: 'calc((100vw - 720px) / 2.5 * (-1))',
          }}
        >
          <TableOfContents
            items={tocItems}
            currentHeaderUrl={currentHeaderUrl}
          />
        </div>
      )}
      <Elements.Hr />
      <Bio />
      <PostNavigator pageContext={pageContext} />
      {!!disqusShortName && (
        <Disqus
          post={post}
          shortName={disqusShortName}
          siteUrl={siteUrl}
          slug={pageContext.slug}
        />
      )}
      {!!utterances && <Utterances repo={utterances} />}
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280, truncate: true)
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "YYYY년 MM월DD일 HH시")
      }
    }
  }
`
