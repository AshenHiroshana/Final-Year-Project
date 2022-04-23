import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Auction, AuctionDataPage} from '../entities/auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<AuctionDataPage>{
    const url = pageRequest.getPageRequestURL('auctions');
    const auctionDataPage = await this.http.get<AuctionDataPage>(ApiManager.getURL(url)).toPromise();
    auctionDataPage.content = auctionDataPage.content.map((auction) => Object.assign(new Auction(), auction));
    return auctionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<AuctionDataPage>{
    const url = pageRequest.getPageRequestURL('auctions/basic');
    const auctionDataPage = await this.http.get<AuctionDataPage>(ApiManager.getURL(url)).toPromise();
    auctionDataPage.content = auctionDataPage.content.map((auction) => Object.assign(new Auction(), auction));
    return auctionDataPage;
  }

  async get(id: number): Promise<Auction>{
    const auction: Auction = await this.http.get<Auction>(ApiManager.getURL(`auctions/${id}`)).toPromise();
    return Object.assign(new Auction(), auction);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`auctions/${id}`)).toPromise();
  }

  async add(auction: Auction): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`auctions`), auction).toPromise();
  }

  async update(id: number, auction: Auction): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`auctions/${id}`), auction).toPromise();
  }

}
