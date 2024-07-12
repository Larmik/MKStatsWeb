import { Injectable } from '@angular/core';
import { WarEntity, db } from '../db';
import { War } from '../models/war';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class DatabaseService {
  
    public async writeWars(wars: War[]) {
        await db.wars.bulkAdd(wars.map(war => War.toEntity(war)))
    }
  
    public getWars(): Observable<WarEntity[]> {
        return from(db.wars.toArray());
      }

    public async clear() {
       await db.wars.clear()
    }
  }
  
