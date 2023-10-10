import React, { Component } from 'react';

class LiveTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: null,
            startLocation: null,
            stopLocation: null,
            addressInfo: {},
            trackingActive: false,
            price: 5,
            distanceTraveled: 0,
        };
    }

    trackingInterval = null;

    startTracking = () => {
        if (navigator.geolocation) {
            this.updateLocation();
            this.trackingInterval = setInterval(this.updateLocation, 5000);
            this.setState({ trackingActive: true });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    };

    stopTracking = () => {
        clearInterval(this.trackingInterval);
        this.setState({ trackingActive: false, stopLocation: this.state.currentLocation });
    };

    updateLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            this.setState({ currentLocation: { latitude, longitude } });

            if (!this.state.startLocation) {
                this.setState({ startLocation: { latitude, longitude } });
            }

            if (this.state.startLocation) {

                const distance = this.calculateDistance(
                    this.state.startLocation.latitude,
                    this.state.startLocation.longitude,
                    latitude,
                    longitude
                );


                const price = 5 + distance * 3;
                this.setState({ price, distanceTraveled: distance });
            }

            fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e19a6bb7e37a4d7cb58b999daaf13c16`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.results && data.results.length > 0) {
                        const addressInfo = data.results[0].components;
                        this.setState({ addressInfo });
                    } else {
                        console.error('No results found in geocoding response');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching address information:', error);
                });
        });
    };

    calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    };

    render() {
        return (

            <div className="container-fluid" style={{ height: '100vh', padding: "0" }}>
                <div className="backgroundimage">
                    <div className="d-flex justify-content-between">
                        <button
                            onClick={this.state.trackingActive ? this.stopTracking : this.startTracking}
                            className="btn btn-primary"
                        >
                            {this.state.trackingActive ? 'Stop rit' : 'Start rit'}
                        </button>
                    </div>

                    {this.state.currentLocation && (
                        <div className="">
                            <p><strong>Afstand gereisd:</strong> {this.state.distanceTraveled.toFixed(2)} km</p>
                            <p><strong>Prijs:</strong> {this.state.price.toFixed(2)} EUR</p>
                        </div>
                    )}

                    {this.state.addressInfo && (
                        <div className="">
                            <p><strong>Straatnaam:</strong> {this.state.addressInfo.road}</p>
                            <p><strong>Stad:</strong> {this.state.addressInfo.city}</p>
                            <p><strong>Provincie:</strong> {this.state.addressInfo.state}</p>
                            <p><strong>Land:</strong> {this.state.addressInfo.country}</p>
                        </div>
                    )}

                    {this.state.startLocation && (
                        <div className="">
                            <p><strong>Start Locatie:</strong></p>
                            <p><strong>Latitude:</strong> {this.state.startLocation.latitude}</p>
                            <p><strong>Longitude:</strong> {this.state.startLocation.longitude}</p>
                        </div>
                    )}

                    {this.state.stopLocation && (
                        <div className="">
                            <p><strong>Stop Locatie:</strong></p>
                            <p><strong>Latitude:</strong> {this.state.stopLocation.latitude}</p>
                            <p><strong>Longitude:</strong> {this.state.stopLocation.longitude}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default LiveTracking;
