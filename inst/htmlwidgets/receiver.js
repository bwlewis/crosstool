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
          if(Array.isArray(e.value)) {
            // the usual crosstalk selection array values
            val = e.value;
          } else {
            // non-standard selection object value (FIXME we should switch to using _extraInfo)
            val = e.value.object;
          }
          if(x.indexed) {
            // Assume that 'val' is a single index
            // TODO: consider linking this to the SharedData array
            //       and extending to multiple indices
            el.children[0][x.value] = x.indexed[val];
          } else el.children[0][x.value] = val;
        });
      },
      resize: function(width, height) { }
    };
  }
});
