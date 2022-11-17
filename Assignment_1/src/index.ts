import * as https from "https";

enum RequestMethod {
  get = "GET",
  post = "POST",
  put = "PUT",
  patch = "PATCH",
  delete = "DELETE",
}

interface RequestOptions {
  hostname: string;
  path?: string,
  method: RequestMethod,
  headers: {
    [key:string]: string
  }
}

const episodeRequestOptions: RequestOptions = {
  hostname: 'rickandmortyapi.com',
  path: '/api/episode',
  method: RequestMethod.get,
  headers: {
    'Content-Type': 'application/json',
  },
};

const characterRequestOptions: RequestOptions = {
  hostname: 'rickandmortyapi.com',
  method: RequestMethod.get,
  headers: {
    'Content-Type': 'application/json',
  },
};

const hitExternalRequest = async (url: string) => {
  let data = '';

  const finalResponse = new Promise((res, rej) => {
    const request = https.get(url, (response) => {
      // Avoding binary data
      response.setEncoding('utf8');
  
      // Concatenating Chunks into one variable while streaming
      response.on('data', (chunk) => {
        data += chunk;
      });
  
      // Listener which gets executed on receiving the complete response
      response.on('end', () => {
        let result: any = JSON.parse(data);
        let resultObj = {
          success: true,
          data: result
        };
        return res(resultObj);
      });
    });
  
    // Logging errors if present in the API request
    request.on('error', (error) => {
      console.error(error);
      let errorObj = {
        error: true,
        errorMessage: error,
      }
      return rej(errorObj);
    });
  
    // End the request
    request.end();

  });
  return finalResponse;
}

const getCharacter = async (characterUrl: string) => {
  return await hitExternalRequest(characterUrl);
}

const getEpisodes = async () => {
  let episodeUrl = "https://rickandmortyapi.com/api/episode";
  let response:any = await hitExternalRequest(episodeUrl);
  let results: any = response?.data?.results;
  if(results?.length > 0) {
    const finalResults = Promise.all(
      results.map(async (episode) => {
        const characters = episode?.characters;
        const modifiedCharacters = await Promise.all(characters.map(async (character, indexCharacter) => {
          let rt:any = await getCharacter(character);
          return rt?.data;
        }));
        return {
          ...episode, characters: modifiedCharacters
        }
      })
    ).then((finalResponse) => {
      console.log("Final")
      console.log(finalResponse);
    });
  }
};

getEpisodes();