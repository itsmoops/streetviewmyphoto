var map
var latitude = 25
var longitude = -80
var defaultZoom = 3
function initMap() {
	var defaultCenter = { lat: latitude, lng: longitude }
	map = new google.maps.Map(document.getElementById('map'), {
		center: defaultCenter,
		zoom: defaultZoom,
		draggable: false,
		zoomControl: true,
		scrollwheel: true,
		disableDoubleClickZoom: false,
		streetViewControl: false,
		zoomControl: false,
		mapTypeControl: false,
		styles: [
			{ elementType: 'geometry', stylers: [{ color: '#1f1514' }] },
			{
				elementType: 'labels.text.stroke',
				stylers: [{ color: '#1f1514' }]
			},
			{
				elementType: 'labels.text.fill',
				stylers: [{ color: '#f2e9e5' }]
			},
			{
				featureType: 'administrative.locality',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'poi',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'geometry',
				stylers: [{ color: '#263c3f' }]
			},
			{
				featureType: 'poi.park',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#6b9a76' }]
			},
			{
				featureType: 'road',
				elementType: 'geometry',
				stylers: [{ color: '#38414e' }]
			},
			{
				featureType: 'road',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#212a37' }]
			},
			{
				featureType: 'road',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#9ca5b3' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry',
				stylers: [{ color: '#746855' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'geometry.stroke',
				stylers: [{ color: '#1f2835' }]
			},
			{
				featureType: 'road.highway',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#f3d19c' }]
			},
			{
				featureType: 'transit',
				elementType: 'geometry',
				stylers: [{ color: '#2f3948' }]
			},
			{
				featureType: 'transit.station',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#d59563' }]
			},
			{
				featureType: 'water',
				elementType: 'geometry',
				stylers: [{ color: '#ccaf8d' }]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.fill',
				stylers: [{ color: '#515c6d' }]
			},
			{
				featureType: 'water',
				elementType: 'labels.text.stroke',
				stylers: [{ color: '#17263c' }]
			}
		]
	})
	panMap(map)
}

var mapRotation
function panMap(map) {
	mapRotation = setInterval(function() {
		longitude++
		var panPoint = new google.maps.LatLng(latitude, longitude)
		map.panTo(panPoint)
	}, 90)
}

var dropzone = new Dropzone('#dropzone')
dropzone.on('complete', function(file) {
	var latDecDegrees
	var longDecDegrees

	EXIF.getData(file, function() {
		var photoLatitude = EXIF.getTag(this, 'GPSLatitude')
		var photoLongitude = EXIF.getTag(this, 'GPSLongitude')

		var photoLatitudeRef = EXIF.getTag(this, 'GPSLatitudeRef') || 'N'
		var photoLongitudeRef = EXIF.getTag(this, 'GPSLongitudeRef') || 'W'

		latDecDegrees =
			(photoLatitude[0] +
				photoLatitude[1] / 60 +
				photoLatitude[2] / (60 * 60)
			).toFixed(4) * (photoLatitudeRef == 'N' ? 1 : -1)
		longDecDegrees =
			(photoLongitude[0] +
				photoLongitude[1] / 60 +
				photoLongitude[2] / (60 * 60)
			).toFixed(4) * (photoLongitudeRef == 'W' ? -1 : 1)

		var panPoint = new google.maps.LatLng(latDecDegrees, longDecDegrees)
		var marker = new google.maps.Marker({
			position: panPoint,
			map: map
		})

		$('#dropzone').fadeOut(1500)
		$('#dimmer').fadeOut(1500, function() {
			clearInterval(mapRotation)

			map.panTo(panPoint)
			map.setCenter(panPoint)

			setTimeout(function() {
				map.setZoom(10)
				setTimeout(function() {
					map.setZoom(18)
					setTimeout(function() {
						$('#map').hide()
						$('#pano').show()
						$('#reset').show()
						var panorama = new google.maps
							.StreetViewPanorama(
							document.getElementById('pano'),
							{
								position: panPoint,
								pov: {
									heading: 34,
									pitch: 10
								}
							}
						)
						map.setStreetView(panorama)
					}, 2000)
				}, 2000)
			}, 2000)
		})
	})
})

$('#reset').click(function() {
	window.location.reload()
})
