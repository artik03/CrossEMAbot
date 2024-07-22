import axios from "axios";

export interface FetchedToken {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
}

export interface FetchedTokenData {
  [key: string]: FetchedToken;
}

export interface FetchedTokenResponse {
  data: FetchedTokenData;
  timeTaken: number;
}

export class TokenFetcher {
  public async fetchToken(
    address: string
  ): Promise<FetchedTokenResponse | null> {
    try {
      const baseUrl = "https://price.jup.ag/v6/price?ids=";
      const response = await axios.get(`${baseUrl}${address}`);

      if (response.status === 200) {
        return response.data as FetchedTokenResponse;
      } else {
        throw new Error(
          `Query failed with status code ${response.status}: ${response.statusText}`
        );
      }
    } catch (error: any) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  public async fetchMultipleTokenData(
    tokenAddresses: string[]
  ): Promise<FetchedTokenResponse | null> {
    const tokenIds = tokenAddresses.join(",");

    try {
      const baseUrl = "https://price.jup.ag/v6/price?ids=";
      const response = await axios.get(`${baseUrl}${tokenIds}`);
      console.log(response.data);
      return response.data as FetchedTokenResponse;
    } catch (error: any) {
      console.error(`Error fetching token data: ${error}`);
      return null;
    }
  }
}
