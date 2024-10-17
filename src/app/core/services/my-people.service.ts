import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Paginated } from "../models/paginated.model";
import { Observable, map } from "rxjs";
import { PaginatedRaw } from "../repositories/impl/json-server-repository.service";
import { Person } from "../models/person.model";


export interface PersonRaw {
    id: string
    nombre: string
    apellidos: string
    email: string
    genero: string
    grupoId: string
}

@Injectable({
    providedIn:'root'
})

export class MyPeopleService{

    private apiUrl:string = "http://localhost:300/personas"

    constructor(
        private http:HttpClient
    ){

    }

    getAll(page:number, pageSize:number): Observable<Paginated<Person>> {
        return this.http.get<PaginatedRaw<PersonRaw>>(
            `${this.apiUrl}/?_page=${page}&_per_page=${pageSize}`)
            .pipe(map(res => {
                return {
                    page: page, pageSize: pageSize, pages: res.pages, data: res.data.map<Person>((d: PersonRaw) => {
                        return {
                            id: d.id,
                            name: d.nombre,
                            surname: d.apellidos,
                            age: (d as any)["age"] ?? 0, //Doble interrogacion es un ternario pero solo cno dos campos, devuelve lo primero si no devuelve lo segundo, asi no hay que hacer tres opciones
                            picture: (d as any)["picture"] ? {
                                large: (d as any)["picture"].large,
                                thumbnail: (d as any)["picture"].thumbnail
                            } : undefined
                        };
                    })
                };
            }));
    }
}
