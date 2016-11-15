import { app } from '/client/main';

app.directive('iconView', function(itemsGenerator) {
    return {
      scope: {
        iconViewSettings: '='
      },
      templateUrl: 'client/directives/icon-view/icon-view.html',
      link: function (scope, element) {
        scope.settings = scope.iconViewSettings || {};

        scope.settings = {
          containerWidth: scope.settings.containerWidth || 300,
          containerHeight: scope.settings.containerHeight || 300,
          itemWidth: scope.settings.itemWidth || 90,
          itemHeight: scope.settings.itemHeight || 90,
          items: scope.settings.items || [],
          addItems: scope.settings.addItems || function(items) {
            scope.settings.items = _.union([], scope.settings.items, items);
          },
          removeItems: scope.settings.removeItems || function(itemIds) {
            if (itemIds && itemIds.length) {
              scope.settings.items = _.filter(scope.settings.items, (item) => !itemIds.includes(item.id));
              scope.infiniteItems = _.filter(scope.infiniteItems, (item) => !itemIds.includes(item.id));
            }
          },
          checkItems: scope.settings.checkItems || function(itemIds) {
            if (itemIds && itemIds.length) {
              itemIds.forEach((itemId) => {
                const item = _.findWhere(scope.settings.items, { id: itemId });

                scope.settings.items[scope.settings.items.indexOf(item)].checked = true;
              });
            }
            else {
              scope.settings.items = scope.settings.items.map((item) => {
                item.checked = true;
                return item
              });
            }
          },
          uncheckItems: scope.settings.uncheckItems || function(itemIds) {
            if (itemIds && itemIds.length) itemIds.forEach((itemId) => {
              const item = _.findWhere(scope.settings.items, { id: itemId });

              scope.settings.items[scope.settings.items.indexOf(item)].checked = false;
            });
          },
          events: scope.settings.events || {
            checkAllItems: () => {
              const checkedItems = _.where(scope.settings.items, { checked: true });

              if (checkedItems.length) {
                scope.settings.uncheckItems(_.pluck(checkedItems, 'id'));
              }
              else {
                scope.settings.checkItems();
              }
            },
            removeCheckedItems: () => {
              const checkedItems = _.where(scope.settings.items, { checked: true });

              if (checkedItems.length) {
                scope.settings.removeItems(_.pluck(checkedItems, 'id'));
              }
            },
            clickItem: (item) => {
              if (item.checked) {
                scope.settings.uncheckItems([item.id]);
              } else {
                scope.settings.checkItems([item.id]);
              }
            }
          }
        }

        scope.itemsCount = 200;
        scope.loadPerCount = 30;

        scope.regenerateItems = (number) => {
          scope.settings.items = itemsGenerator.generate(number);
          scope.infiniteItems = _.first(scope.settings.items, scope.loadPerCount);

          scope.loadedItemsCount = scope.infiniteItems.length;
          scope.canLoadMore = scope.settings.items.length - scope.loadedItemsCount > 0;
        }
        scope.regenerateItems(scope.itemsCount);

        scope.containerStyles = {
          width: scope.settings.containerWidth,
          height: scope.settings.containerHeight
        }

        scope.itemStyles = {
          width: scope.settings.itemWidth,
          height: scope.settings.itemHeight
        }

        scope.loadMoreItems = () => {
          if (scope.canLoadMore) {
            scope.$apply(() => {
              scope.infiniteItems = _.first(scope.settings.items, scope.loadedItemsCount+scope.loadPerCount);

              scope.loadedItemsCount = scope.infiniteItems.length;
              scope.canLoadMore = scope.settings.items.length - scope.loadedItemsCount > 0;
            });
          }
        }
      }
    };
  });
