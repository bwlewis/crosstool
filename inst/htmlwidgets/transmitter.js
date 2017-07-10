HTMLWidgets.widget({
  name: 'transmitter',       // see also receiver and transceiver
  type: 'output',

  factory: function(el, width, height) {
    var antenna = {channel: null};
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) {
          if(x.channel == "filter") antenna.channel = new crosstalk.FilterHandle();
          else antenna.channel = new crosstalk.SelectionHandle();
          antenna.channel.setGroup(x.crosstalk_group);
        }
        el.innerHTML = x.innerHTML;
        if(el.children && el.children.length > 0) {
          el.children[0].addEventListener("change", function() {
            var val = el.children[0][x.value];
            if(!Array.isArray(val)) val = [val];
            val = [].concat.apply([], val); // flatten in case element returns more than one array?
            antenna.channel.set(val);
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
          antenna.channel.set(val);
        }
      },
      resize: function(width, height) { }
    };
  }
});
