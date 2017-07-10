# Crosstool: A Generic Control Widget for Crosstalk

Create widgets that send control information, for example from sliders or other
HTML elements ("transmitters"). Or make widgets that receive information from
crosstalk apps ("receivers"). Transmitters and receivers use one-sided
communication unlike most other crosstalk widgets.  Or transceive and
optionally transcode key information from one crosstalk group to another
("transceiver").

See https://rstudio.github.io/crosstalk/ for details on crosstalk.

This prototype defines three ridiculously barebones generic widget classes:
transmitter, receiver, and transceiver. Unlike typical crosstalk widgets, these
widgets are generally _uni-directional_, either transmitting or receiving data,
respectively, on a crosstalk _selection_ interface.  "Transceiver" widgets use
two one-sided communication channels, one for each crosstalk group (receiving
on one group and transmitting to the other).

The widget is intended as low-level prototype for generic user-interface
control elements, similar to the control widgets available in shiny. They can
be used with other crosstalk-enabled widgets that can benefit from external
user-interface controls.

This is a crude, wacky prototype!

## A Dumb Example

```{r}
library(crosstalk)
library(crosstool)
library(htmltools)
library(d3scatter)

s = SharedData$new(data.frame(key=paste(2:11)), key=~key)

slider = widget(s, "transmitter", "<input type='range' min='2' max='11'/>", width=200)
box = widget(s, "receiver", "<input type='textarea' style='height:200px;font-size:14pt;'/>", height=400, width=400)
span = widget(s, "receiver", "<span style='font-size:14pt;'/>", value="innerText", width=200, lookup=letters[1:10])

s2 = SharedData$new(data.frame(x=rnorm(5), y=rnorm(5)))
relay = widget(s, "transceiver", html="", value="innerHTML", lookup=list(1:2, 2:5, 2, 3, 1:5, 4:5, 1, 2, 3, 4), relay=s2)
span2 = widget(s2, "receiver", "<span style='font-size:14pt;'/>", value="innerText")
d3 = d3scatter(s2, x=~x, y=~y)

p1 = tags$div(list(tags$h3("HTML range slider"), slider))
p2 = tags$div(list(tags$h3("the raw slider values in a text box"), box))
p3 = tags$div(list(tags$h3("an HTML SPAN element with looked up values from the slider:") , span))
p4 = tags$div(list(tags$h3("an HTML SPAN with transcoded transceiver values") , span2, relay))

browsable(tags$div(list(d3, bscols(p1, p2, p3, p4, widths=c(3,3,3,3)))))
```

See the output here:
https://bwlewis.github.io/crosstool/example.html

## Better Example

...
