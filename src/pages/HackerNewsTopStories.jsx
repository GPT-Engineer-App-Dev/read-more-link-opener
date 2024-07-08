import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResponse.json();
    })
  );
  return stories;
};

const HackerNewsTopStories = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <Skeleton key={index} className="w-full h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Failed to load stories.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Input
        placeholder="Search stories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Upvotes: {story.score}</p>
              <Button as="a" href={story.url} target="_blank" rel="noopener noreferrer">
                Read more
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HackerNewsTopStories;