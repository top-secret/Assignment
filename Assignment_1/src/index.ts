import * as https from "https";

/********** DEFINING CONSTANTS, TYPES, ENUMS, INTERFACES *******/

enum RequestMethod {
  get = "GET",
  post = "POST",
  put = "PUT",
  patch = "PATCH",
  delete = "DELETE",
}

/**
 * Type declaration for Episode Entity
 */
 export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string; 
}

/**
* Type declaration for Episode Character Entity
*/
export interface EpisodeCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  type?: string;
  gender: string;
  origin: EpisodeCharacterOrigin;
  location: EpisodeCharacterLocation;
  episode: string[];
  image: string;
  url: string;
  created: string;
}

/**
* Type declaration for Episode Character origin Entity
*/
interface EpisodeCharacterOrigin {
  name: string;
  url: string;
}

/**
* Type declaration for Episode Character Location Entity
*/
interface EpisodeCharacterLocation {
  name: string;
  url: string;
}

/**
* Type declaration for Http request
*/
export interface HttpRequestOptions {
  hostname: string;
  path?: string,
  method: RequestMethod,
  headers: {
    [key:string]: string
  }
}

/**
* Type declaration for HTTP Response
*/
export interface HttpResponse<T = any> {
  data?: T;
  success?: boolean;
  error?: boolean;
}

/**
* Type declaration defining type of Episode API response
*/
export interface EpisodeHttpReponse {
  results: Episode[]
}


const episodeEndpointHttpRequestOptions: HttpRequestOptions = {
  hostname: "rickandmortyapi.com",
  path: "/api/episode",
  method: RequestMethod.get,
  headers: {
    "Content-Type": "application/json",
  },
};

const characterEndpointHttpRequestOptions: HttpRequestOptions = {
  hostname: "rickandmortyapi.com",
  method: RequestMethod.get,
  headers: {
    "Content-Type": "application/json",
  },
};

/********** MAIN CODE FOR THE ASSIGNMENT *******/

/**
 * Common helper to make external HTTP request
 *
 * @param {HttpRequestOptions} options
 * @returns {Promise<HttpResponse<T>>}
 */
const makeExternalRequest = async <T>(
  options: HttpRequestOptions
): Promise<HttpResponse<T>> => {
  return new Promise((resolve, reject) => {
    let data = "";

    const request = https.request(options, (response) => {
      // Avoiding binary data
      response.setEncoding("utf8");

      // Concatenating Chunks into one variable while streaming
      response.on("data", (chunk) => {
        data += chunk;
      });

      // Listener which gets executed on receiving the complete response
      response.on("end", () => {
        if (response.statusCode > 299) {
          return reject(new Error(response.statusMessage));
        }
        const result: T = JSON.parse(data);
        const resultObj = {
          success: true,
          data: result,
        };
        return resolve(resultObj);
      });
    });

    // Logging errors if present in the API request
    request.on("error", (error) => {
      const errorObj = {
        error: true,
        errorMessage: error,
      };
      return reject(errorObj);
    });

    // End the request
    request.end();
  });
};

/**
 * Fetch character detailss
 *
 * @param {string} characterUrl
 * @returns {Promise<EpisodeCharacter>}
 */
const getEpisodeCharacter = async (
  characterUrl: string
): Promise<EpisodeCharacter | string> => {
  try {
    const { data, success, error } =
      await makeExternalRequest<EpisodeCharacter>({
        ...characterEndpointHttpRequestOptions,
        path: characterUrl,
      });

    return data as EpisodeCharacter; // Typecast Added for readability
  } catch (error) {
    //If error then just return the original url as fallback
    if (error) {
      return characterUrl;
    }
  }
};

/**
 * Fetch list of the Episodes
 *
 * @returns {Promise<Episode[]>}
 */
const fetchEpisode = async (): Promise<Episode[]> => {
  const { data } = await makeExternalRequest<EpisodeHttpReponse>(
    episodeEndpointHttpRequestOptions
  );

  return data.results;
};

/**
 * Fetches episodes list anf async fetch each episode character details
 * @returns
 */
const main = async () => {
  const episodes: Episode[] = await fetchEpisode();

  // Notice use of await because of "try catch"
  return Promise.all(
    episodes.map(async (episode) => {
      const characterUrls = episode.characters;
      // Asynchronously fetch character details using url
      const characterDetails = await Promise.all(
        characterUrls.map(
          async (characterUrl) => await getEpisodeCharacter(characterUrl)
        )
      );

      return {
        ...episode,
        characters: characterDetails,
      };
    })
  );
};

/** Main Function to start the Node app and execute the code to fetch the list of Episodes */
main()
  .then((response) => console.log(response))
  .catch((error) => {
    console.log(`Something bad happened: ${error.stack}`);
  });

/********** END OF CODE *******/