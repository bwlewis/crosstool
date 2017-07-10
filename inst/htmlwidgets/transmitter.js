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
            if(x.type && x.type == "object") {
              // non-standard selection object value (FIXME switch to use _extraInfo)
              ct_sel.set({object: el.children[0][x.value]});
            } else {
              var val = el.children[0][x.value];
              if(!Array.isArray(val)) val = [val];
              ct_sel.set(val);
            }
          });
        }
        if(x.init) {
          if(x.type && x.type == "object") {
            if(x.lookup) ct_sel.set({object: x.lookup[x.init]});
            else ct_sel.set({object: x.init});
            return;
          }
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
