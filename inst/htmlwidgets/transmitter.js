HTMLWidgets.widget({
  name: 'transmitter',       // see also receiver and transceiver
  type: 'output',

  factory: function(el, width, height) {
    var ct_sel = new crosstalk.SelectionHandle();
    var ct_filter = new crosstalk.FilterHandle();
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          ct_sel.setGroup(x.crosstalk_group);
          ct_filter.setGroup(x.crosstalk_group);
        }
        el.innerHTML = x.innerHTML;
        if(el.children && el.children.length > 0) {
          el.children[0].addEventListener("change", function() {
            var val = el.children[0][x.value];
            if(!Array.isArray(val)) val = [val];
            val = [].concat.apply([], val); // flatten in case element returns more than one array?
            ct_sel.set(val);
          });
        }
        if(x.init) {
          var val;
          if(Array.isArray(x.init)) {
            if(x.lookup) val = x.init.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            else val = x.init;
          } else {
            if(x.lookup) val = [x.lookup[x.crosstalk_key.indexOf(x.init)]];
            else val = [x.init];
          }
          ct_sel.set(val);
        }
      },
      resize: function(width, height) { }
    };
  }
});
