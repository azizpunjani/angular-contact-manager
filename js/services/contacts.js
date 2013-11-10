contactManager.factory('Contacts', ['$resource', 'Cache', function($resource, Cache) {
   var Contacts; 

    Contacts = $resource('/contacts/:id',{ id: '@_id' }, {
        query: { method: 'GET', params: { id: '' }, isArray: true },
        update: { method: 'PUT', params: { id: '@id' } }
    });

    return {
        getAll: function(useCache) {                
            var contacts,
            useCache = useCache || true;

            if (Cache.isLoaded() && useCache) {
                return Cache.getContacts();      
            } else {
                contacts = Contacts.query(function(){
                    Cache.putContacts(contacts);
                });
                return contacts;
            }
        },

        get: function(id) {    
            return Cache.getContact(id) || Contacts.get({ id: id });
        }, 

        create: function(contact, success, failure) {
           var newContact = new Contacts(contact);

           newContact.$save(function(){
              Cache.addContact(newContact);
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
            var contactIndex = Cache.indexOf(contact._id);

            contact.$delete(function(){
                Cache.removeContactByIndex(contactIndex);
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