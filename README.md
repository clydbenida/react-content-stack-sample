# ReactJS & ContentStack Basic Implementation

This project provides info how you can properly integrate contentstack into bare react app without any scaffolding from other code.

# Getting entries

## Old implementation
```js
const App = () => {
  const [data, setData] = useState()
  // Define axios and query
  const api = axios.create({
    baseURL: 'https://cdn.contentstack.io/v3/content_types/',
    headers: {
        api_key : process.env.REACT_APP_SA_KEY,
        access_token : process.env.REACT_APP_SA_TOKEN
    } 
  });
  const query = 'section_blocks.slider_experience.category&include[]=section_blocks.article.featured_article&include[]=section_blocks.article.category&include[]=section_blocks.experience_slider.slider_info.reference';

  // Define getter in useEffect
  useEffect(() => {
    const apiget = async (content_type) => {
      await api.get( `${content_type}/entries/?environment=${process.env.REACT_APP_SA_ENV}&include[]=${query}` ).then(function(response){
        setData(response.data?.entries[0].section_blocks);
        boot();
      });
    }
    apiget('home_page_landing');
  }, [])
  
  return (
    // do something...
  )
}
```

## Implementation with `contentstack` package

### Boilerplate code for defining Stack object

This code is from the create-react-app-starter repo from contentful. You can check out the code [here](https://github.com/contentstack/contentstack-react-starter-app). This defined so that as a developer we won't have to define axios objects everytime we need to fetch something from contentstack.

```js
import * as contentstack from "contentstack";
import * as Utils from "@contentstack/utils";

const Stack = contentstack.Stack({
  api_key: process.env.REACT_APP_SA_KEY,
  delivery_token: process.env.REACT_APP_SA_TOKEN,
  environment: process.env.REACT_APP_SA_ENV,
});

const renderOption = {
  ["span"]: (node, next) => {
    return next(node.children);
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  /**
   *
   * fetches all the entries from specific content-type
   * @param {* content-type uid} contentTypeUid
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   *
   */
  getEntry({ contentTypeUid, referenceFieldPath, jsonRtePath }) {
    return new Promise((resolve, reject) => {
      const query = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) query.includeReference(referenceFieldPath);
      query
        .includeOwner()
        .toJSON()
        .find()
        .then(
          (result) => {
            jsonRtePath &&
              Utils.jsonToHTML({
                entry: result,
                paths: jsonRtePath,
                renderOption,
              });
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  },

  /**
   *fetches specific entry from a content-type
   *
   * @param {* content-type uid} contentTypeUid
   * @param {* url for entry to be fetched} entryUrl
   * @param {* reference field name} referenceFieldPath
   * @param {* Json RTE path} jsonRtePath
   * @returns
   */
  getEntryByUrl({ contentTypeUid, entryUrl, referenceFieldPath, jsonRtePath }) {
    return new Promise((resolve, reject) => {
      const blogQuery = Stack.ContentType(contentTypeUid).Query();
      if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
      blogQuery.includeOwner().toJSON();
      const data = blogQuery.where("url", `${entryUrl}`).find();
      data.then(
        (result) => {
          jsonRtePath &&
            Utils.jsonToHTML({
              entry: result,
              paths: jsonRtePath,
              renderOption,
            });
          resolve(result[0]);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
```

### Define helpers for fetching contentstack contents
```js
import Stack from "../sdk/entry.d";

export const getHomePageLandingRes = async () => {
  const response = await Stack.getEntry({
    contentTypeUid: "home_page_landing",
  });
  return response[0][0];
};
```
