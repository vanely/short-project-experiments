NEXT APP STRUCTURE

Pages:
- Where we define all of the pages and routes for the application.
- Entry point: _app(.js, .jsx, .ts, .tsx)

- structure for route/page that can dynamically accept an entity's id
/cars      index.js // this will act the page that displays our list of entities
/cars/:id  [<param-name>].js // this will be where we get access to the query param details, via the use of the useRouter from 'next-router'
    * URL ends up looking like: 
    * localhost:3000/cars // displays the list of all cars
    * localhost:3000/cars/golf-gti-mk6 // displays the car that was selected
    * let's implement some static rendering to this approach, and we want to fetch data from an external source.

- api directory
    * used to setup routes that will only apply to the server
    * NOTE: the code written here won't increase the size of the bundle that's sent over the network.
    * NOTE: the code written here won't be executed on the client-side.
    * the code written here will only be executed on the server-side. This is the place to perform tasks that are only specific to the backend, or if you want to expose an endpoint to end users.

Styles:
- Global Styles
    * global styles are imported at the app's entry point, and apply across the entire  app
- Component Styles
    * EX: Home.module.css
    * style files that can be imported into components, and the styles can be use in any component, as object fields passed to the className prop

===================================================================================     

Data Fetching:
- getStaticProps:
    * used for static site generation (SSG)
    * runs at build time
    * returns props that are used to pre-render pages at build time
    * can be used with getStaticPaths to pre-render pages with dynamic routes
- getServerSideProps:
    * used for server-side rendering (SSR)
    * runs on each request
    * returns props that are used to render pages on each request
- getStaticPaths:
    * used with getStaticProps to pre-render pages with dynamic routes
    * returns an array of paths that should be pre-rendered at build time
- API Routes:
    * used to handle API requests
    * can be used to fetch data on the server-side
    * can be used to handle POST, PUT, DELETE, etc. requests
- SWR (React Query):
    * used to handle data fetching on the client-side
    * provides caching, pagination, and other features out of the box
    * can be used with getStaticProps and getServerSideProps to handle data fetching on the server
- useSWR:
    * a hook that provides data fetching and caching capabilities
    * can be used to fetch data on the client-side
    * provides caching, pagination, and other features out of the box
- useSWRInfinite:
    * a hook that provides infinite loading capabilities
    * can be used to fetch data on the client-side
    * provides caching, pagination, and other features out of the box
- useSWRConfig:
    * a hook that provides configuration options for SWR
    * can be used to customize the behavior of SWR
    * provides options for caching, pagination, and other features
- useSWRHook:
    * a hook that provides a custom hook for SWR
    * can be used to create a custom hook for data fetching
    * provides caching, pagination, and other features out of the box
- useSWRDevtools:
    * a hook that provides devtools for SWR
    * can be used to debug and inspect the state of SWR
    * provides features for debugging and inspecting the state of SWR
- useSWRBatch:
    * a hook that provides batch data fetching capabilities
    * can be used to fetch multiple pieces of data at once
    * provides caching, pagination, and other features out of the box

-----------------------------------------------------------------------------------
Next allows us to fetch data and render HTML on the server
- content is delivered to the user quicker due to prerendering, and is more easily found with SEO and crawled by bots.

Options for server rendering [SSG(Static Site Generation), SSR(Server Side Rendering)]
- SSG: pre-render pages at build time, faster and more scalable, but less flexible
    * also called pre-rendering because all of the HTML is generated at build time which can then be uploaded to a storage bucket, or static host, and they can be delivered with high performance over a CDN.
    * a draw back is that this data can become stale, if the data on the server changes, those pre-rendered HTML files have to be re-rendered, and redeployed
    * this can be hard to scale to many pages. If your site has a million pages this rendering approach can be a very slow process.
    * this approach is best suited for sites that don't change often, and have a small amount of total pages.
        * a blog
        * a marketing site
        * a documentation site
- SSR: render pages on each request, more flexible, but slower and less scalable
- ISR (Incremental Static Regeneration): a mix of SSG and SSR, allows for faster updates to static pages
