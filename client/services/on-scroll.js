import { app } from '/client/main';

app.directive('onScroll', function() {
    return {
      scope: {
        onScroll: '='
      },
      link: function (scope, element) {
        element.on('scroll', (event) => {
          if (element[0].scrollHeight - element[0].offsetHeight - element[0].scrollTop <= 0) {
            scope.onScroll();
          }
        });
      }
    };
  });
