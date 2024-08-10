import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationsRepository.find();
  }

  findByCity(city: string): Promise<Location[]> {
    return this.locationsRepository.find({ where: {city} });
  }
}
