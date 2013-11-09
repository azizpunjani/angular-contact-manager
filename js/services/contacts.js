contactManager.factory('Contacts', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
   var cache,
       Contacts; 

    Contacts = $resource('/contacts/:id',{ id: '@_id' }, {
        query: { method: 'GET', params: { id: '' }, isArray: true },
        update: { method: 'PUT', params: { id: '@id' } }
    });

    cache = (function(){
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
    })();


    return {
        getAll: function(useCache) {                
            var contacts,
            useCache = useCache || true;

            if (cache.isLoaded() && useCache) {
                return cache.getContacts();      
            } else {
                contacts = Contacts.query(function(){
                    cache.putContacts(contacts);
                });
                return contacts;
            }
        },

        get: function(id) {    
            return cache.getContact(id) || Contacts.get({ id: id });
        }, 

        create: function(contact, success, failure) {
           var newContact = new Contacts(contact);

           newContact.$save(function(){
              cache.addContact(newContact);
              if (typeof success === 'function') {
                  success.apply(null, arguments); 
              }
           }, function(){
              if (typeof failure === 'function') {
                  failure.apply(null, arguments); 
              }
           });
        },

        delete: function(contact, success) {
            var contactIndex = cache.indexOf(contact._id);

            contact.$delete(function(){
                cache.removeContactByIndex(contactIndex);
                if (typeof success === 'function') {
                    success.apply(null, arguments);
                }
            }, function() {
                if (typeof failure === 'function') {
                    failure.apply(null, arguments);
                }
            });
            
        },

        update: function(contact, success) {
            contact.$update(function(){
               success.apply(null, arguments);
            });  
        }
    }
}]);