// Use jQuery ajax
domino.utils.ajax = $.ajax

// Hack: preventing a bug related to a port in a URL for Ajax
domino.settings({
    shortcutPrefix: "::"
    ,verbose: true
})

// X-Editable: inline mode
$.fn.editable.defaults.mode = 'inline';

;(function($, domino, undefined){
    
    // Check that config is OK
    if(HYPHE_CONFIG === undefined)
        alert('Your installation of Hyphe has no configuration.\nCreate a file at "_config/config.js" in the same directory than index.php, with at least this content:\n\nHYPHE_CONFIG = {\n"SERVER_ADDRESS":"http://YOUR_RPC_ENDPOINT_URL"\n}')

    // Stuff we reuse often when we initialize Domino
    var rpc_url = HYPHE_CONFIG.SERVER_ADDRESS
        ,rpc_contentType = 'application/x-www-form-urlencoded'
        ,rpc_type = 'POST'
        ,rpc_expect = function(data){return data[0].code == 'success'}
        ,rpc_error = function(data){alert('Oops, an error occurred... \n\nThe server says:\n'+data)}

    var D = new domino({
        properties: [
            {
                id:'currentWebEntity'
                ,dispatch: 'currentWebEntity_updated'
                ,triggers: 'update_currentWebEntity'
            },{
                id:'nameValidation'
                ,dispatch: 'nameValidation_updated'
                ,triggers: 'update_nameValidation'
            },{
                id:'statusValidation'
                ,dispatch: 'statusValidation_updated'
                ,triggers: 'update_statusValidation'
            },{
                id:'homepageValidation'
                ,dispatch: 'homepageValidation_updated'
                ,triggers: 'update_homepageValidation'
            }
        ],services: [
            {
                id: 'getCurrentWebEntity'
                ,setter: 'currentWebEntity'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITIES.GET,
                        'params' : [
                            [settings.shortcuts.webEntityId]    // List of web entities ids
                        ],
                    })}
                ,path:'0.result.0'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'setCurrentWebEntityName'
                ,setter: 'nameValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.SET_NAME,
                        'params' : [
                            settings.shortcuts.webEntityId      // web entity id
                            ,settings.shortcuts.name            // new name
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'setCurrentWebEntityStatus'
                ,setter: 'statusValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.SET_STATUS,
                        'params' : [
                            settings.shortcuts.webEntityId      // web entity id
                            ,settings.shortcuts.status          // new status
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            },{
                id: 'setCurrentWebEntityHomepage'
                ,setter: 'homepageValidation'
                ,data: function(settings){ return JSON.stringify({ //JSON RPC
                        'method' : HYPHE_API.WEBENTITY.SET_HOMEPAGE,
                        'params' : [
                            settings.shortcuts.webEntityId      // web entity id
                            ,settings.shortcuts.homepage        // new homepage
                        ],
                    })}
                ,path:'0.result'
                ,url: rpc_url, contentType: rpc_contentType, type: rpc_type, expect: rpc_expect, error: rpc_error
            }
        ],hacks:[
        ]
    })

    //// Modules

    // Log stuff in the console
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            console.log('Current web entity', webEntity)
        }

        this.triggers.events['nameValidation_updated'] = function(d) {
            var nameValidation = d.get('nameValidation')
            console.log('nameValidation', nameValidation)
        }
    })

    // Page title
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#pageTitle').text('Edit: '+webEntity.name)
        }
    })

    // Identity table: ID
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#id').text(webEntity.id)
        }
    })

    // Identity table: Dates
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#dates').text('Created '+Utils.prettyDate(webEntity.creation_date).toLowerCase()+', modified '+Utils.prettyDate(webEntity.last_modification_date).toLowerCase())
        }
    })

    // Crawl status
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#crawl').html('')
            $('#crawl').append(
                $('<span/>').text(webEntity.crawling_status+' ')
            ).append(
                $('<span class="muted"/>').text('(Indexing: '+webEntity.indexing_status.toLowerCase()+') - ')
            ).append($('<a href="crawl_new.php#we_id='+webEntity.id+'">new crawl</a>'))
            
        }
    })

    // Prefixes
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#lru_prefixes').html('')
            webEntity.lru_prefixes.forEach(function(lru_prefix){
                $('#lru_prefixes').append(
                    $('<tr/>').append(
                        $('<td/>').text(Utils.LRU_to_URL(lru_prefix))
                    ).append(
                        $('<td>').append(
                            $('<a class="btn btn-link pull-right"/>')
                                .attr('href', Utils.LRU_to_URL(lru_prefix))
                                .attr('target', 'blank')
                                .append($('<i class="icon-share-alt"/>'))
                        )
                    )
                )
            })
            
        }
    })

    // Editable name
    D.addModule(function(){
        domino.module.call(this)
        $('#name').editable({
            type: 'text'
            ,inputclass: 'input-xlarge'
            ,title: 'Enter name'
            ,disabled: true
            ,unsavedclass: null
            ,validate: function(name){
                $('.editable').editable('disable')
                var webEntity = D.get('currentWebEntity')
                D.request('setCurrentWebEntityName', {shortcuts:{
                    webEntityId: webEntity.id
                    ,name: name
                }})
            }
        })
        
        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#name').editable('option', 'value', webEntity.name)
            $('#name').editable('enable')
        }
    })

    // Editable home page
    D.addModule(function(){
        domino.module.call(this)
        $('#homepage').editable({
            type: 'text'
            ,inputclass: 'input-xlarge'
            ,title: 'Enter home page URL'
            ,disabled: true
            ,unsavedclass: null
            ,validate: function(homepage){
                var webEntity = D.get('currentWebEntity')
                if(homepage != ''){
                    if(!Utils.URL_validate(homepage))
                        return 'URL is invalid'

                    // Check that the homepage is in one of the LRU prefixes
                    var homepage_lru = Utils.URL_to_LRU(homepage)
                        ,lru_valid = false
                    webEntity.lru_prefixes.forEach(function(lru_prefix){
                        if(homepage_lru.indexOf(lru_prefix) == 0)
                            lru_valid = true
                    })
                    if(!lru_valid)
                        return 'URL does not belong to this web entity (see the prefixes)'
                }

                $('.editable').editable('disable')
                D.request('setCurrentWebEntityHomepage', {shortcuts:{
                    webEntityId: webEntity.id
                    ,homepage: homepage
                }})
            }
        })
        
        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#homepage').editable('option', 'value', webEntity.homepage || '')
            $('#homepage').editable('enable')
        }
    })

    // Editable status
    D.addModule(function(){
        domino.module.call(this)
        $('#status').editable({
            type: 'select'
            ,title: 'Select status'
            ,disabled: true
            ,unsavedclass: null
            ,source: [
                {value: 'UNDECIDED', text: "UNDECIDED"}
                ,{value: 'IN', text: "IN"}
                ,{value: 'OUT', text: "OUT"}
                ,{value: 'DISCOVERED', text: "DISCOVERED"}
            ]
            ,validate: function(status){
                $('.editable').editable('disable')
                var webEntity = D.get('currentWebEntity')
                D.request('setCurrentWebEntityStatus', {shortcuts:{
                    webEntityId: webEntity.id
                    ,status: status
                }})
            }
        })
        
        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            $('#status').editable('option', 'value', webEntity.status)
            $('#status').editable('enable')
        }
    })

    // User Tags
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
                ,userTagCategories = webEntity.tags.USER || {}
            
            $('#tags_User').html('')
            for(var cat in userTagCategories){
                $('#tags_User').append(
                    $('<tr/>').append(
                        $('<th/>').append(
                            $('<a></a>').editable({
                                type: 'text'
                                ,inputclass: 'input-small'
                                ,value: cat
                                ,title: 'Select category name'
                                ,unsavedclass: null
                                /*,validate: function(status){
                                    $('.editable').editable('disable')
                                    var webEntity = D.get('currentWebEntity')
                                    D.request('setCurrentWebEntityStatus', {shortcuts:{
                                        webEntityId: webEntity.id
                                        ,status: status
                                    }})
                                }*/
                            })
                        )
                    ).append(
                        $('<td/>').append(
                            $('<a></a>').editable({
                                type: 'select2'
                                ,inputclass: 'input-xxlarge'
                                ,value: userTagCategories[cat]
                                ,select2: {
                                    multiple: true
                                    ,tags: userTagCategories[cat]
                                }
                                // ,value: userTagCategories[cat]
                                ,title: 'Select tags'
                                // ,disabled: true
                                ,unsavedclass: null
                                /*,validate: function(status){
                                    $('.editable').editable('disable')
                                    var webEntity = D.get('currentWebEntity')
                                    D.request('setCurrentWebEntityStatus', {shortcuts:{
                                        webEntityId: webEntity.id
                                        ,status: status
                                    }})
                                }*/
                            })
                        )
                    )
                )
            }
        }
    })

    // Other Tags
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['currentWebEntity_updated'] = function(d) {
            var webEntity = d.get('currentWebEntity')
            
            $('#tags_Other').html('')
            for(var namespace in webEntity.tags){
                if(namespace != "USER"){
                    $('#tags_Other').append(
                        $('<table class="table table-tags"></table>').append(
                            Object.keys(webEntity.tags[namespace]).map(function(cat, i){
                                var columns = []
                                if(i==0){
                                    columns.push(
                                        $('<th/>')
                                            .text(namespace)
                                            .attr('rowspan', Object.keys(webEntity.tags[namespace]).length)
                                    )
                                }
                                columns.push(
                                    $('<th/>').text(cat)
                                )
                                columns.push(
                                    $('<td/>').append(
                                        webEntity.tags[namespace][cat].map(function(tag){
                                            return $('<p/>').text(tag)
                                        })
                                    )
                                )
                                return $('<tr/>').append(columns)
                            })
                        )
                    )
                }
            }
        }
    })

    // Reload all current web entity on property update
    D.addModule(function(){
        domino.module.call(this)

        this.triggers.events['nameValidation_updated', 'statusValidation_updated', 'homepageValidation_updated'] = function() {
            D.request('getCurrentWebEntity', {shortcuts:{
                webEntityId: D.get('currentWebEntity').id
            }})
        }
    })


    //// On load, get the web entity
    $(document).ready(function(e){
        D.request('getCurrentWebEntity', {shortcuts:{
            webEntityId: Utils.hash.get('we_id')
        }})
    })

})(jQuery, domino)