function Marker(name, coord){
    this.name = name;
    this.coordinates = coord;
}

function Map(){
    this.markers = [];

    this.addMarker = function(marker){
        this.markers.append(marker);
    };
}
