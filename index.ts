/**
 * @license
 * Copyright 2021 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AmbientLight,
  DirectionalLight,
  Matrix4,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";



import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let map: google.maps.Map;

const mapOptions = {
  tilt:0,
  heading: 0,
  zoom: 18,
  center: { lat: 50.2746, lng: -4.7917 },
  mapId: "15431d2b469f209e",
  // disable interactions due to animation loop and moveCamera
  disableDefaultUI: true,
  gestureHandling: "cooperative",
  keyboardShortcuts: true,
};

const locations = [
  { lat: 50.2746, lng: -4.7917 },
  { lat: 10.2750, lng: -1.7920 },
  { lat: 30.2752, lng: -60.7915 },
  { lat: 0.2748, lng: -2.7912 },
  { lat: 150.2749, lng: -23.7919 },
];

function initMap(): void {
  const mapDiv = document.getElementById("map") as HTMLElement;
  map = new google.maps.Map(mapDiv, mapOptions);
  initWebglOverlayView(map);
}
/*
function initWebglOverlayView(map: google.maps.Map): void {
  let scene, renderer, camera, loader;
  let isCameraAnimating = true;
  const webglOverlayView = new google.maps.WebGLOverlayView();

  webglOverlayView.onAdd = () => {
    // Set up the scene.

    scene = new Scene();

    camera = new PerspectiveCamera();

    const ambientLight = new AmbientLight(0xffffff, 0.90); // Soft white light.
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0, 0, 0);
    scene.add(directionalLight);

    // Load the model.
    loader = new GLTFLoader();
    const source = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Embedded/Duck.gltf";
    loader.load(source, (gltf) => {
      gltf.scene.scale.set(25, 25, 25);
      gltf.scene.rotation.x = Math.PI; // Rotations are in radians.
      gltf.scene.rotation.set(Math.PI / 2, 0, 0);
      
      scene.add(gltf.scene);
    });
  };

  webglOverlayView.onContextRestored = ({ gl }) => {
    // Create the js renderer, using the
    // maps's WebGL rendering context.
    renderer = new WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // Wait to move the camera until the 3D model loads.
    loader.manager.onLoad = () => {
      renderer.setAnimationLoop(() => {
        webglOverlayView.requestRedraw();
        const { tilt, heading, zoom } = mapOptions;
        map.moveCamera({ tilt, heading, zoom });

        // Rotate the map 360 degrees.
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5;
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
          mapOptions.zoom -= 0.0005;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };
  };

  webglOverlayView.onDraw = ({ gl, transformer }): void => {
    const latLngAltitudeLiteral: google.maps.LatLngAltitudeLiteral = {
      lat: mapOptions.center.lat,
      lng: mapOptions.center.lng,
      altitude: 100,
    };

    // Update camera matrix to ensure the model is georeferenced correctly on the map.
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new Matrix4().fromArray(matrix);

    webglOverlayView.requestRedraw();
    renderer.render(scene, camera);

    // Sometimes it is necessary to reset the GL state.
    renderer.resetState();
  };
  webglOverlayView.setMap(map);

    map.addListener("click", () => {
    isCameraAnimating = false;
  });
}
*/
function initWebglOverlayView(map: google.maps.Map): void {
  let scene, renderer, camera;
  let isCameraAnimating = true;
  const webglOverlayView = new google.maps.WebGLOverlayView();

  // List of different locations
  const locations = [
    { lat: 150.2746, lng: -4.7917 },
    { lat: 90.2750, lng: -24.7920 },
    { lat: 50.2752, lng: -34.7915 },
    { lat: 50.2748, lng: -4.7912 },
    { lat: 50.2749, lng: -4.7919 },
  ];

  webglOverlayView.onAdd = () => {
    scene = new Scene();
    camera = new PerspectiveCamera();

    const ambientLight = new AmbientLight(0xffffff, 0.90);
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0, 0, 0);
    scene.add(directionalLight);

    // Load the model for each location
    const loader = new GLTFLoader();
    locations.forEach((location, index) => {
      loader.load("https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
        gltf.scene.scale.set(25, 25, 25);
       // gltf.scene.rotation.x = Math.PI;
        gltf.scene.rotation.set(Math.PI / 2, 0, 0);
        gltf.scene.position.set(location.lng, location.lat, 0); // Set the position
        scene.add(gltf.scene);
      });
    });
  };

  webglOverlayView.onContextRestored = ({ gl }) => {
    renderer = new WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    const loader = new GLTFLoader();
    const onLoad = () => {
      renderer.setAnimationLoop(() => {
        webglOverlayView.requestRedraw();
        const { tilt, heading, zoom } = mapOptions;
        map.moveCamera({ tilt, heading, zoom });

        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5;
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
          mapOptions.zoom -= 0.0005;
        } else {
          renderer.setAnimationLoop(null);
        }
      });
    };

    // Wait to move the camera until all 3D models load
    loader.manager.onLoad = onLoad;
    locations.forEach(() => {
      loader.load("path-to-your-model.gltf", () => {});
    });
  };

  webglOverlayView.onDraw = ({ gl, transformer }): void => {
    locations.forEach((location, index) => {
      const latLngAltitudeLiteral: google.maps.LatLngAltitudeLiteral = {
        lat: location.lat,
        lng: location.lng,
        altitude: 100,
      };

      const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
      camera.projectionMatrix = new Matrix4().fromArray(matrix);

      webglOverlayView.requestRedraw();
      renderer.render(scene, camera);
      renderer.resetState();
    });
  };

  webglOverlayView.setMap(map);

  map.addListener("click", () => {
    isCameraAnimating = false;
  });
}


declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
