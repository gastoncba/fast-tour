import { PlaceVisitedRepository } from "../repositories/repository";
import { HotelService } from "./hotel.service";
import { PlaceService } from "./place.service";

const placeService = new PlaceService();
const hotelService = new HotelService();

export class PlaceVisitedService {
  constructor() {}

  async create(placesVisited: { placeId: number; hotelId: number }) {
    const { placeId, hotelId } = placesVisited
    const place = await placeService.findOne(placeId.toString())
    const hotel = await hotelService.findOne(hotelId.toString())

    const placeVisited = PlaceVisitedRepository.create({ hotel, place });
    return await PlaceVisitedRepository.save(placeVisited);
  }
}
