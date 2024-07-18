"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFetcher = void 0;
const axios_1 = __importDefault(require("axios"));
class TokenFetcher {
    constructor() {
        this.baseUrl = "https://price.jup.ag/v6/price?ids=";
    }
    fetchToken(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}${address}`);
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    throw new Error(`Query failed with status code ${response.status}: ${response.statusText}`);
                }
            }
            catch (error) {
                throw new Error(`Error fetching data: ${error.message}`);
            }
        });
    }
    fetchMultipleTokenData(tokenAddresses) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenIds = tokenAddresses.join(",");
            try {
                const response = yield axios_1.default.get(`${this.baseUrl}${tokenIds}`);
                return response.data;
            }
            catch (error) {
                console.error(`Error fetching token data: ${error}`);
                return null;
            }
        });
    }
}
exports.TokenFetcher = TokenFetcher;
