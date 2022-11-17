"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["get"] = "GET";
    RequestMethod["post"] = "POST";
    RequestMethod["put"] = "PUT";
    RequestMethod["patch"] = "PATCH";
    RequestMethod["delete"] = "DELETE";
})(RequestMethod || (RequestMethod = {}));
const episodeRequestOptions = {
    hostname: 'rickandmortyapi.com',
    path: '/api/episode',
    method: RequestMethod.get,
    headers: {
        'Content-Type': 'application/json',
    },
};
const characterRequestOptions = {
    hostname: 'rickandmortyapi.com',
    method: RequestMethod.get,
    headers: {
        'Content-Type': 'application/json',
    },
};
const hitExternalRequest = (url) => __awaiter(void 0, void 0, void 0, function* () {
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
                let result = JSON.parse(data);
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
            };
            return rej(errorObj);
        });
        // End the request
        request.end();
    });
    return finalResponse;
});
const getCharacter = (characterUrl) => __awaiter(void 0, void 0, void 0, function* () {
    return yield hitExternalRequest(characterUrl);
});
const getEpisodes = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let episodeUrl = "https://rickandmortyapi.com/api/episode";
    let response = yield hitExternalRequest(episodeUrl);
    let results = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.results;
    if ((results === null || results === void 0 ? void 0 : results.length) > 0) {
        const finalResults = Promise.all(results.map((episode) => __awaiter(void 0, void 0, void 0, function* () {
            const characters = episode === null || episode === void 0 ? void 0 : episode.characters;
            const modifiedCharacters = yield Promise.all(characters.map((character, indexCharacter) => __awaiter(void 0, void 0, void 0, function* () {
                let rt = yield getCharacter(character);
                return rt === null || rt === void 0 ? void 0 : rt.data;
            })));
            return Object.assign(Object.assign({}, episode), { characters: modifiedCharacters });
        }))).then((finalResponse) => {
            console.log("Final");
            console.log(finalResponse);
        });
    }
});
getEpisodes();
