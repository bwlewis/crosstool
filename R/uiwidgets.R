#' Create a generic HTML crosstalk user interface endpoint.
#'
#' Use \code{widget} to define generic HTML elements with limited
#' crosstalk functionality. These elements can be used to control
#' crosstalk-enabled applications.
#' @param class The transmitter and receiever widgets use limited uni-directional crosstalk
#'        communication. Transceiver widgets are more like normal crosstalk widgets.
#' @param html A valid HTML object string.
#' @param value The HTML object's I/O field name, for instance 'value' for some 'input' HTML elements.
#' @param crosstalk A crosstalk SharedData object. Currently only used for the crosstalk group.
#' @param ... Additional arguments passed directly to the JavaScript code.
#' @return An HTML widget object.
#' @note Typical differences with standard crosstalk widgets
#' \enumerate{
#' \item{Mostly use uni-directional communication, either transmitting or receiving data but not both.}
#' \item{Transmit raw values from the HTML object, not indexed shared data frame values.}
#' }
#' @export
widget <- function(class=c("transmitter", "receiver", "transceiver"),
                     html, value="value", crosstalk, ..., width=NULL, height=NULL)
{
  x <- c(innerHTML=html, value=value, list(...))
  x$crosstalk_key <- NULL
  x$crosstalk_group <- NULL
  if (is.SharedData(crosstalk))
  {
    x$crosstalk_key <- crosstalk$key()
    x$crosstalk_group <- crosstalk$groupName()
  }

  htmlwidgets::createWidget(
          name = class,
          x = x,
          width = width,
          height = height,
          htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
          dependencies = crosstalk::crosstalkLibs(),
          package = "uiwidgets")
}
