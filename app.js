(function(){
  'use strict';

  angular.module('searchInJson',[])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService',MenuSearchService)
  .constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
  .directive('foundItems',foundItemsDirective);

  function foundItemsDirective(){
    var ddo={
      templateUrl:'listItems.html',
      scope:{
        items:'<',
        onRemove:'&',
        errorMessage:'<'
      }
    };
    return ddo;
  }

  NarrowItDownController.$inject=['MenuSearchService'];

  function NarrowItDownController(MenuSearchService){
    var controller=this;
    controller.searchTerm="";
    controller.errorMessage=false;
    controller.founded=Array();

    controller.removeItem=function(index){
      controller.founded.splice(index,1);

    }
    controller.getMatchedMenuItems=function(){

      var promise=MenuSearchService.getMatchedMenuItems(controller.searchTerm);
      promise.then(function(result){
          controller.founded=result;

          if (controller.founded.length===0){
            controller.errorMessage=true;
          }
          else{
            controller.errorMessage=false;
          }
        
        })
      .catch(function(error){
        console.log("Something Wrong");
      });
    }
  }


  MenuSearchService.$inject=['$http','ApiBasePath'];
  function MenuSearchService($http,ApiBasePath){
    var service=this;
    service.getMatchedMenuItems=function(searchTerm){
      var response=$http({
        method:"GET",
        url:(ApiBasePath+"/menu_items.json")
      });

      return response.then(function(result){
        var foundItems=service.mathItems(result.data.menu_items,searchTerm);
        return foundItems;
      });
    };
    service.mathItems=function(data,searchTerm){
      if(searchTerm===""){
        return Array();
      }

      var founded=Array();
      data.forEach(function(entry){
        if(entry.description.indexOf(searchTerm)!=-1){
          founded.push(entry);
        }
      });
      return founded;
    };
  }

})();
