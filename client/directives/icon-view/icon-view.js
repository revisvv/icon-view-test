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
              scope.infiniteItems = _.first(scope.settings.items, scope.loadedItemsCount);
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

        scope.containerStyles = {
          width: scope.settings.containerWidth,
          height: scope.settings.containerHeight
        }

        scope.itemStyles = {
          width: scope.settings.itemWidth,
          height: scope.settings.itemHeight
        }

        scope.itemsCount = 200;
        scope.calculateLoadPerCount = () => {
          const cols = Math.floor(scope.containerStyles.width/(scope.itemStyles.width+2));
          const rows = Math.floor(scope.containerStyles.height/(scope.itemStyles.height+2));

          return cols*(rows+1);
        }
        scope.loadPerCount = scope.calculateLoadPerCount();

        scope.updateInfiniteValues = (number) => {
          scope.infiniteItems = _.first(scope.settings.items, number);

          scope.loadedItemsCount = scope.infiniteItems.length;
          scope.canLoadMore = scope.settings.items.length - scope.loadedItemsCount > 0;
        }

        scope.reloadInfiniteItems = (forced) => {
          const newLoadPerCount = scope.calculateLoadPerCount();

          if (scope.loadPerCount !== newLoadPerCount || forced) {
            scope.loadPerCount = newLoadPerCount;

            scope.updateInfiniteValues(scope.loadPerCount);
          }
        }

        scope.regenerateItems = (number) => {
          scope.settings.items = itemsGenerator.generate(number);

          scope.reloadInfiniteItems(true);
        }
        scope.regenerateItems(scope.itemsCount);

        scope.loadMoreItems = () => {
          if (scope.canLoadMore) {
            scope.$apply(() => {
              scope.updateInfiniteValues(scope.loadedItemsCount+scope.loadPerCount);
            });
          }
        }

        scope.$watch('itemStyles.width', () => {
          scope.reloadInfiniteItems();
        });

        scope.$watch('itemStyles.height', () => {
          scope.reloadInfiniteItems();
        });

        scope.$watch('containerStyles.width', () => {
          scope.reloadInfiniteItems();
        });

        scope.$watch('containerStyles.height', () => {
          scope.reloadInfiniteItems();
        });
      }
    };
  });
