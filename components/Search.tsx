"use client";

import React, { useState, useEffect } from 'react';
import index from '../lib/algolia';

interface SearchResult {
    objectID: string;
    post_title: string;
    post_type_label: string;
    permalink: string;
    _highlightResult: {
        post_title: {
            value: string;
        };
    };
}

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [facetFilters, setFacetFilters] = useState<string[][]>([]);
    const [selectedPostType, setSelectedPostType] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        if (query.length > 0 || facetFilters.length > 0) {
            search();
        } else {
            setResults([]);
        }
    }, [query, facetFilters]);

    const search = async () => {
        try {
            const searchParams: any = {
                query,
                facets: ["taxonomies.post_tag", "post_type_label", "taxonomies_hierarchical.category.lvl0", "post_author.display_name"],
                facetFilters,
                highlightPreTag: '__ais-highlight__',
                highlightPostTag: '__/ais-highlight__',
                hitsPerPage: 10,
                maxValuesPerFacet: 15,
            };

            const { hits }: any = await index.search(searchParams);
            setResults(hits);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedPostType(value);
        updateFacetFilters('post_type_label', value);
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const updatedTags = e.target.checked
            ? [...selectedTags, value]
            : selectedTags.filter((tag) => tag !== value);

        setSelectedTags(updatedTags);
        updateFacetFilters('taxonomies.post_tag', updatedTags);
    };

    const updateFacetFilters = (facet: string, value: string | string[]) => {
        const updatedFacetFilters = facetFilters.filter((filter) => filter[0].indexOf(facet) === -1);

        if (Array.isArray(value)) {
            value.forEach((val) => {
                updatedFacetFilters.push([`${facet}:${val}`]);
            });
        } else if (value) {
            updatedFacetFilters.push([`${facet}:${value}`]);
        }

        setFacetFilters(updatedFacetFilters);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={handleQueryChange}
                    className="w-full p-2 border rounded"
                    placeholder="Search by title..."
                />
            </div>
            <div className="mb-4">
                <select
                    value={selectedPostType}
                    onChange={handlePostTypeChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Post Type</option>
                    <option value="Books">Books</option>
                    <option value="Articles">Articles</option>
                    {/* Add more post types as needed */}
                </select>
            </div>
            <div className="mb-4">
                <label>
                    <input
                        type="checkbox"
                        value="Tag1"
                        onChange={handleTagChange}
                        checked={selectedTags.includes('Tag1')}
                    />
                    Tag1
                </label>
                <label className="ml-2">
                    <input
                        type="checkbox"
                        value="Tag2"
                        onChange={handleTagChange}
                        checked={selectedTags.includes('Tag2')}
                    />
                    Tag2
                </label>
                {/* Add more tags as needed */}
            </div>
            <ul className="mt-4">
                {results.map((hit) => (
                    <li key={hit.objectID} className="p-2 border-b">
                        <a href={hit.permalink} className="text-blue-600 hover:underline">
                            <div dangerouslySetInnerHTML={{ __html: hit._highlightResult.post_title.value }} />
                        </a>
                        <p className="text-gray-500">{hit.post_type_label}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;
