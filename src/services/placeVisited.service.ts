import { PlaceVisited } from "../entities";
import { PlaceVisitedRepository } from "../repositories/repository";
import { HotelService } from "./hotel.service";
import { PlaceService } from "./place.service";
import { IService } from "./private/IService";

const placeService = new PlaceService();
const hotelService = new HotelService();

export class PlaceVisitedService implements IService<PlaceVisited> {
  constructor() {}
  find(query?: Record<string, any> | undefined, relations?: string[] | undefined): Promise<PlaceVisited[]> {
    throw new Error("Method not implemented.");
  }
  findOne(id: string, relations?: string[] | undefined): Promise<PlaceVisited> {
    throw new Error("Method not implemented.");
  }
  update(id: string, changes: Record<string, any>): Promise<PlaceVisited> {
    throw new Error("Method not implemented.");
  }
  remove(id: string): Promise<void> | Promise<any> {
    throw new Error("Method not implemented.");
  }


  async create(placesVisited: { placeId: number; hotelId: number }) {
    const { placeId, hotelId } = placesVisited;
    const place = await placeService.findOne(placeId.toString());
    const hotel = await hotelService.findOne(hotelId.toString());

    const placeVisited = PlaceVisitedRepository.create({ hotel, place });
    return await PlaceVisitedRepository.save(placeVisited);
  }
}
