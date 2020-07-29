/*
 * This file allows the user to add a new listing.
 * Author: Justin Nichols
 * Class: CSC337
 */

/*
 * Adds an item to the database.
 */
function addItem() {
  let seller = $('#seller').val();
  $.ajax({
    url: `add/item/${seller}`,
    method: 'POST',
    data: {  
      title: $('#title').val(),  
      desc: $('#desc').val(), 
      image: $('#image').val(),  
      price: $('#price').val(),  
      avail: $('#avail').val(),  
      seller: $('#seller').val()  
    }
  });
}
