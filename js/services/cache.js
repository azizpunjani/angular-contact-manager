contactManager.factory('Cache', [function(){
    var contacts = [], 
        isLoaded = false;

    return {
        getContacts: function() {
            return contacts;
        }, 

        putContacts: function(newContacts) {
            contacts = newContacts;
            isLoaded = true;
        }, 

        addContact: function(contact) {
            contacts.push(contact);
        },
        
        isLoaded: function() {
            return isLoaded;
        }, 

        indexOf: function(id) {
            var arrayIndex; 
            contacts.forEach(function(contact, index){
                if (id === contact._id) {
                    arrayIndex = index;
                    return true;
                }
            });
            return arrayIndex;
        },

        removeContact: function(id) {
            contacts.forEach(function(contact, index){
                if (id === contact._id) {
                    contacts.splice(index, 1);
                    return true;
                }
            });
        },

        removeContactByIndex: function(index) {
            contacts.splice(index, 1);
        },

        getContact: function(id) {
            var cachedContact; 
            contacts.forEach(function(contact, index) {
                if (id === contact._id) {
                    cachedContact = contact;
                    return true;
                } 
            });
            return cachedContact;
        }
    }
}]);