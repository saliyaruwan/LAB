window.App = Ember.Application.create();

App.Router.map(function() {
  this.resource('index', { path: '/' });
  this.route('session', { path: '/session' });
});

App.IndexControler = Ember.Controller.extend({
   
});

var computed = Ember.computed;
var alias = computed.alias;

App.PaginationPagerComponent =Ember.Component.extend({
  tagName: 'ul',
  classNameBindings: ['pager:pager:pagination', 'isHidden:hidden', 'paginationSizeClass'],
  pager: false,
  hide: false,
  pagerNext: 'Next',
  pagerPrevious: 'Previous',
  paginationPrevious: '«',
  paginationNext: '»',
  seperator: '…',
  countOut: 2,
  countIn: 2,
  firstPage: 1,
  current: 1,
  lastPage: alias('count'),

  currentPage: computed('current', function () {
    return Number(this.get('current'));
  }),

  paginationSizeClass: computed('paginationSize', function () {
    var size = this.get('size');
    var pager = this.get('pager');

    return !pager && size && (size === 'lg' || size === 'sm') ? 'pagination-' + size : '';
  }),

  isFirst: computed('firstPage', 'current', function () {
    return this.get('current') === this.get('firstPage');
  }),

  isLast: computed('lastPage', 'current', function () {
    return this.get('current') === this.get('lastPage');
  }),

  isHidden: computed('hide', 'count', function () {
    if (this.get('hide')) {
      return (this.get('count') === 1);
    }
    return false;
  }),

  pages: computed('count', 'current', 'countOut', 'countIn', function () {
    var seperator = this.get('seperator');
    var current = this.get('current');
    var count = this.get('count');
    var countOut = this.get('countOut');
    var countIn = this.get('countIn');
    var result = [];
    var i;

    // Beginning group of pages: n1...n2
    var n1 = 1;
    var n2 = Math.min(countOut, count);

    // Ending group of pages: n7...n8
    var n7 = Math.max(1, (count - countOut + 1));
    var n8 = count;

    // Middle group of pages: n4...n5
    var n4 = Math.max(n2 + 1, current - countIn);
    var n5 = Math.min(n7 - 1, current + countIn);
    var useMiddle = (n5 >= n4);

    // Point n3 between n2 and n4
    var n3 = Math.floor((n2 + n4) / 2);
    var useN3 = (useMiddle && ((n4 - n2) > 1));

    // Point $n6 between $n5 and $n7
    var n6 = Math.floor((n5 + n7) / 2);
    var useN6 = (useMiddle && ((n7 - n5) > 1));

    var links = [];

    // Generate links data in accordance with calculated numbers
    for (var n = n1; n <= n2; n++) {
      links[n] = n;
    }

    if (useN3) {
      links[n3] = seperator;
    }

    for (i = n4; i <= n5; i++) {
      links[i] = i;
    }

    if (useN6) {
      links[n6] = seperator;
    }

    for (i = n7; i <= n8; i++) {
      links[i] = i;
    }

    links.forEach(function (content, number) {
      result.push(content);
    });

    return result;
  }),

  click: function (event) {
    // stop `#` from jumping to top of page
    event.preventDefault();
  },

  actions: {
    next: function () {
      if (!this.get('isLast')) {
        var current = this.get('current');

        this.set('current', parseInt(current, 10) + 1);
      }
    },

    previous: function () {
      if (!this.get('isFirst')) {
        var current = this.get('current');

        this.set('current', parseInt(current, 10) - 1);
      }
    },

    pageChanged: function (page, previous) {
      this.sendAction('change', page, previous);
    }
  }
});

App.PageItemComponent = Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['isActive:active'],
  seperator: '…',

  isActive: computed('page', 'selected', function () {
    return this.get('page') === this.get('selected');
  }),

  isDots: computed('page', function () {
    var seperator = this.get('seperator');
    var page = this.get('page');

    return page === seperator;
  }),

  actions: {
    setCurrent: function () {
      var last = this.get('selected');
      var page = this.get('page');

      if (page !== last) {
        this.set('selected', page);
        this.sendAction('pageSet', page, last);
      }
    }
  }
});
