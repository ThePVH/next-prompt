"use client"

import { useState, useEffect } from "react"

import PromptCard from "./PromptCard"

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [posts, setPosts] = useState([])

  // Search state
  const [searchText, setSearchText] = useState("")
  const [searching, setSearching] = useState(null)
  const [searchResults, setSearchResults] = useState([])

  const handleSearchChange = (e) => {
    clearTimeout(searching)
    setSearchText(e.target.value)

    setSearching(
      setTimeout(() => {
        setSearchResults(filterPrompts(e.target.value))
      }, 500)
    )
  }

  const filterPrompts = (searchText) => {
    const regex = new RegExp(searchText, "i")
    const filteredPrompts = posts.filter((post) => {
      return (
        regex.test(post.creator.username) ||
        regex.test(post.tag) ||
        regex.test(post.prompt)
      )
    })
    return filteredPrompts
  }

  const handleTagClick = (tagName) => {
    setSearchText(tagName)
    setSearchResults(filterPrompts(tagName))
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt")
      const data = await response.json()

      setPosts(data)
    }

    fetchPosts()
  }, [])

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  )
}

export default Feed
