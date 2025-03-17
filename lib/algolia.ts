import algoliasearch from 'algoliasearch';

const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );
  
const index = client.initIndex('wp_searchable_posts');

export default index;
