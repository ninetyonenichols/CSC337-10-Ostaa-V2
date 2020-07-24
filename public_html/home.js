/*
 * This file provides functionality to home.html, including the ability to:
 *   1. Search listings
 *   2. Add new listings
 *   3. View purchases
 * Author: Justin Nichols
 * Class: CSC337
 */

/*
 * Searches for listings whose description matches a given keyword.
 */
function searchListings() {
  let keyword = $('#search-bar').val();

  $.ajax({
    url: `/search/items/${keyword}`,
    method: 'GET',
    success: (data) => buildListingArea(data);
  })
}

/*
 * Displays all of the user's current listings.
 */
function viewListings() {
  $.ajax({
    url: '/get/listings/',
    method: 'GET',
    success: (data) => buildListingArea(data);
  })
}

/*
 * Displays all of the user's current purchases.
 */
function viewPurchases() {
  $.ajax({
    url: '/get/purchases/',
    method: 'GET',
    success: (data) => buildListingArea(data);
  })
}

/*
 * Creates a new listing for the user.
 */
function createListings() {
  $.ajax({
    url: '/public_html/post.html',
    method: 'GET'
  })
}

/*
 * This function builds the listing area using the data from the AJAX request
 * @param: data, a String. This is the response data from the AJAX request.
 */
function buildListingArea(data) {
  let listingsHtml="";
  data = data.substring(1, data.length - 1);
  let listings = Array.from(data.split(','));
  listings.forEach((listing) => listingsHtml += serializeListing(listing));
  $('#listingsArea').html(listings);
}

/*
 * This function serializes one listing
 * @param: listing, a String. This is the listing to be serialized.
 */
function serializeListing(listing) {
  let listingHtml = "Lorem Ipsum";
  return listingHtml;
}
