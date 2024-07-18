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
  private baseUrl = "https://price.jup.ag/v6/price?ids=";

  public async fetchToken(
    address: string
  ): Promise<FetchedTokenResponse | null> {
    try {
      const response = await axios.get(`${this.baseUrl}${address}`);

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
      const response = await axios.get(`${this.baseUrl}${tokenIds}`);
      return response.data as FetchedTokenResponse;
    } catch (error: any) {
      console.error(`Error fetching token data: ${error}`);
      return null;
    }
  }
}
