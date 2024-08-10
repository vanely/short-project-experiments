import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson'; 

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('geometry')
  coordinate: Point;

  @Column()
  city: string;
}
