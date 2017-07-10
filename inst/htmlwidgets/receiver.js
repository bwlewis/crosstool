HTMLWidgets.widget({
  name: 'receiver',       // see also transmitter
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
        ct_sel.on("change", function(e) {
          if(e.sender === ct_sel) return;
          var val;
          if(Array.isArray(e.value) && x.lookup) {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
          } else val = e.value;
          if(Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) val = [].concat.apply([], val);
          if(el.children && el.children.length > 0) el.children[0][x.value] = val;
        });
      },
      resize: function(width, height) { }
    };
  }
});
