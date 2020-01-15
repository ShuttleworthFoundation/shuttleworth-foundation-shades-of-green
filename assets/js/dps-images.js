/*jslint browser */
/*globals window */

// Script to place images over a DPS
// ---------------------------------
//
// This script duplicates an image, so that we can place it once
// on the left-hand page, showing its left-hand side, and
// again on the right-hand page, showing its right-hand side.
// This works with _print-dps-image.scss and any custom styling
// on the classes .dps, .dps-image-left, .dps-image-right.
// This should only run on PDF output.

// Get the DPS elements
var ebDPSElements = document.querySelectorAll('.dps');

// Duplicate and tag the element
function ebDPSDuplicate(element) {
    'use strict';
    console.log('Processing DPS image...');

    // Get and duplicate the image
    var imageLeft;
    if (element.tagName === 'img' || element.tagName === 'IMG') {
        imageLeft = element;
    } else {
        imageLeft = element.querySelector('img');
    }
    var imageRight = imageLeft.cloneNode(true);

    // Wrap and position the images
    // (using insertBefore because Prince borks at insertAdjacentElement)

    // Insert the left-image wrapper before the figure
    var imageLeftWrapper = document.createElement('div');
    imageLeftWrapper.classList.add('dps-left');
    imageLeftWrapper.appendChild(imageLeft);
    element.parentNode.insertBefore(imageLeftWrapper, element);

    // Insert the right-image wrapper after the figure
    var imageRightWrapper = document.createElement('div');
    imageRightWrapper.classList.add('dps-right');
    imageRightWrapper.appendChild(imageRight);
    // element.parentNode.insertBefore(imageRightWrapper, element.nextElementSibling);

    // or before the figure
    element.parentNode.insertBefore(imageRightWrapper, element);

    // Add any height classes from the parent to the image wrappers
    var i;
    for (i = 0; i < element.classList.length; i += 1) {
        if (element.classList[i].indexOf('height') !== -1) {
            imageLeftWrapper.classList.add(element.classList[i]);
            imageRightWrapper.classList.add(element.classList[i]);
        }
    }

    // Create the caption element, here copying the node
    // with the project's custom class .feature-image-text
    var ebDPSTextSource = element.querySelector('.feature-image-text');
    var ebDPSTextDestination = document.createElement('div');
    ebDPSTextDestination.classList.add('feature-image-text');

    // Copy HTML from source to destination
    ebDPSTextDestination.innerHTML = ebDPSTextSource.innerHTML;

    // Copy data attributes.
    // Prince does not support dataset.
    ebDPSTextDestination
        .setAttribute('data-color', ebDPSTextSource.getAttribute('data-color'));
    ebDPSTextDestination
        .setAttribute('data-position', ebDPSTextSource.getAttribute('data-position'));
    ebDPSTextDestination
        .setAttribute('data-width', ebDPSTextSource.getAttribute('data-width'));

    // Append the text according to desired position
    if (ebDPSTextSource.getAttribute('data-position').indexOf('left') !== -1) {
        imageLeftWrapper.insertBefore(ebDPSTextDestination, imageLeft);
    } else {
        imageRightWrapper.insertBefore(ebDPSTextDestination, imageRight);
    }

    // Remove the original element
    element.parentNode.removeChild(element);
}

// Loop through images to duplicate and tag
function ebDPSProcess(array) {
    'use strict';
    var i;
    for (i = 0; i < array.length; i += 1) {
        ebDPSDuplicate(array[i]);
    }
}

// Check whether DPS images exist
if (ebDPSElements.length > 0) {
    ebDPSProcess(ebDPSElements);
}
