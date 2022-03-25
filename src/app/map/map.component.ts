import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapLoaderService } from '../map.loader';
import {MapService} from '../services/map.service';
import { Observable } from 'rxjs';
import { google } from "google-maps";

import {Field} from "../models/field.model"
declare var google : google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit,OnInit{
  map: any;
  drawingManager: any;
  point:any;
  fields:Field[];
  points;
   markers = [];
   Overlay;
  constructor(private mapService:MapService) {

  }
  ngOnInit(){
    this.loadField();
  }
  loadField():void{


  }
  ngAfterViewInit() {

this.loadMap();



  }
  loadMap(){
    MapLoaderService.load().then(() => {
      this.drawPolygon();
    })
  }

  drawPolygon() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 55.734603, lng: 37.571374 } ,
      zoom: 20
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [ google.maps.drawing.OverlayType.POLYGON]
      }
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      // Polygon drawn
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        let points=[];
        let area;

        let perimeter;
        let min_lng=event.overlay.getPath().getArray()[0].lng();
        let max_lng=event.overlay.getPath().getArray()[0].lng();
        let min_lat=event.overlay.getPath().getArray()[0].lat();
        let max_lat=event.overlay.getPath().getArray()[0].lat();
        event.overlay.getPath().getArray().forEach(point => {
          let point1={
            "longitude":point.lng(),
            "latitude":point.lat()
          }
          if(point.lng()>max_lng){
            max_lng=point.lng();
          }
          if(point.lat()>max_lat){
max_lat=point.lat();
          }
          if(point.lng()<min_lng){
            min_lng=point.lng();
          }
          if(point.lat()<min_lat){
            min_lat=point.lat();
          }
          points.push(point1);
          area = google.maps.geometry.spherical.computeArea(event.overlay.getPath());
          perimeter= google.maps.geometry.spherical.computeLength(event.overlay.getPath());



        });

        let field={
          "area":area,
          "perimeter":perimeter,
          "points":points,
          "max_lat":max_lat,
          "max_lng":max_lng,
          "min_lat":min_lat,
          "min_lng":min_lng

        }
        this.mapService.createField(field).subscribe(
          data => {
            this.loadFields();

          },
          error => console.log(error));


      }

    });
    this.loadFields();
    this.AddOverlay();

  }

   AddOverlay():void {
    this.mapService
    .getAllFields()
    .subscribe(
      data => {
       data.forEach(field => {
       let coordinates = [];
         coordinates.push({"lat":field.min_lat,lng:field.min_lng})
         coordinates.push({"lat":field.max_lat,lng:field.max_lng})

         this.points = [new google.maps.LatLng(coordinates[0].lat, coordinates[0].lng),
               new google.maps.LatLng(coordinates[1].lat,coordinates[1].lng)];



    var imageBounds = new google.maps.LatLngBounds(this.points[0], this.points[1]);
    //this.Overlay = new google.maps.GroundOverlay('assets/images/Field2_ndvi_04Jun2021 (1).png', imageBounds);
  //  this.Overlay.setMap(this.map);
  })



});}
loadFields():void{
  this.mapService
    .getAllFields()
    .subscribe(
      data => {
       data.forEach(field => {
          let fieldPoints=[];
           field.points.forEach(point => {
             fieldPoints.push({lng:point.longitude,lat:point.latitude})
           });
           const triangleCoords = fieldPoints;
           console.log(fieldPoints)
           // Construct the polygon.
           const bermudaTriangle = new google.maps.Polygon({
             paths: triangleCoords,
             strokeColor: "#FF0000",
             strokeOpacity: 0.8,
             strokeWeight: 2,
             fillColor: "#FF0000",
             fillOpacity: 0.1 ,
           });

           bermudaTriangle.setMap(this.map);
         });      })
}

}
