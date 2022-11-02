const BALLOON_MONSTER = "data:image/png;base64,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"
const CROSS_MONSTER = "data:image/png;base64,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"
const SPEED_MONSTER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAC+lBMVEUAAAAHEwALHAIKFQANHgAHGAASIQAeYBsPIwCGIkkcCgUaWxOYKE12LkZKAh0FLAIKRgwMJQAFLAISTQ0STQ6xG1CWK0UyDxcyCwsENwYDIQAUThBtJEBiKD4nCAOBLk5WMzE3HxgRFwcIMAYELAMlAwAwBAYGLQMTIQAHOwAeUA2cPWNaDS4cFBOnK0gnAAwKEAAxAAFWERQYCQEvIA0iBQFPGxxJGRgjJAUEOQ8DIwAiCwURRBYGGgAjAgEfAgCeLFXPClUwAAQtAALMHGCzIljPGVZ0J0GFFj9oCCg+AQsnAQCuNGPDIFzLDVfbC0+MHUeSCDg2AAT93/DTFl/lB1+gJ1bTFlTKDk7GB06/BEl7IkOIBTuJBjJkBB5QAQ8pAQn/5vrmCmK5GWCuJl/fBl6lKF3ZHV3IC13WClyYMVjBCVWLMlKpIFCjHlCoBD9wBS1JCCJqARoyEAtHAAoNAgECEgDKKWrnEWfDKWXSI2LYEWLIGF7QD17ZBV24I1ugLlqYK1rYCFijJVXWElW5ElXIC1S7DE/EH02zGUe3BUfCE0azAkN7Fzt9CzSEBDSaAjN0ETF+Ay5UFyw8FCVyAB9dABdZARVVARUxAg8TCgEAAAD87/z/yenVuMrWdJXHZ4jCUH3bKGvaG2S1JWPkG2OPPGCiNV+9FlrdElm9KlezK1bjDVTVBlTdFlPFFlG3EkqxCUp9KDx3IjyKEztvKjNsEC9ICyxaCSFUDiBPBhkuABk2ABM/DhJIABESFwL/z/H8web8udfaytbupcbHsrjcZJfTU4fAXH7CP3WoRnHxGnC7NmudRGmnMmDrF1zKF1rjB1KUJFCPK03QDU2pEEbGBkOeBUKEKD5mMz1nHTuYFTuSAy5IEy10DyeIACZEGCN7BiJaBBwsJBc8Bw0AMQABIgD/2O351OrvyuH/v+Hqucr3kML0lbe7prXolrWmh5zCXn+FZXq+U3OSWnLDSXHGOW59VWtXSVRxNEiZE0ZoJTMbAAxbAACwv4zsAAAAPnRSTlMAQWROJlwwCx7+/Rv+/v10Wko9IhP+/vrrmDYr/v7+/fv67ObOx6iDVEM2/f39+/r6+dvb2tLRy8uuro91V2NrdcQAAAPPSURBVDjLYsAE7JgiQvxMjGwsjMxMrCwsHIxMzBwijFLIygSUZ8k5OzslJDg7gYChhJqaqqk1MwtMjdZTxZs5WY0NjY1ZDiDQwMNzmTMnx12CFWbAM/HflxvS0tLCwpqbwxwcwprTwniWa9+SYIbIi1iWJXjt3DHDc2LBxImeux5M3rl5m6enZyGXEivUAKVSr/jp02dMj4uLnzFt10wnr5L4+Lhp+7jsVNlA8txWxZ6BE+7cfzh1S4AHkDFpUl9BgEf//VjPoodGGtzcAAAJAfb+ABM4tatG1NaIqkzO0kBFQUFETW5ASNJkemtNeogWcxkHACk0skVZz66IUVBqbMpFgmJBsW7NH8pRTmmGQUYuvQMAAA8Ks39ZqViqzO3AncTJrXhBd+zAncFkfctpTk0MvQEAAA+aHEx3orCrn8Jh6VOhWmeixsFhnJ3Ga1l8d0wfcwEAACl1Do5db3luW9qenOigiq9NUN34nOefb6JNlUkOPgEAAAY/uFxRb01tcFLww1PIWmewjpSbw2GgjKOMknAOPgIAABFDjWR3RIcVSFLynlPxWWeKXZObxVOfjFdGqGYJ5AIAAALkUKREVFiwtL737lPzWq7WkLabxVOgjFdXQURtugUAAGLdy5mywq+lO3Dal3mJX6PWrc2/5/w68URXerhjiOgMoDel5NzPVbpEuHVOPXvk0LeIlS1dsX/fv1rYXuUSUpUXD7SCsbRwW39+VLjb1bCFx1ubmhz9Wq+fPF5/wW/jhP64IFaQgpl88bER/v5L129sj0xa6xeyOCS7Para7/r0PQmzbEHenBwdc9XN/+L5lUvrUk9nZtQ61tVVpKZWr/CQeWAMdINQEOeS5Bq3Fv81oUlNdZkZGRm1FUmhoUnVGS6VYuaMQAVeAcnZ2ZERV/wvpi6uaW1N9nWpDg0NTc2sbWvLNWNhYGAp5jyTXHPBLX1pRYjrlqlFk253rm9Zs8bfP7ytMqsYaAVgwvtllzU25+a61ifnTdzp5bUv7t7tzo7u7u5OUR/e/UBfSD/TnXJ3e2Fh4fbtU7y97ezsvJ1LphUVFcU9eqQzRUUYmGsky0r/JMzcs2f37t1OQU7O3s5BQV4lJSVezgn6+21AiVJaefbMHQWxMUDwK7C/r9cjwMOjtzfafbL4LHVIsmYqU9wqtnpVvesSV9cUHx+fhuXLs3KWLZMVL+OHKOBWeaywddONG5s2R0dHuwMBL68778+bCo8l4XnzqQGXt7e3PQyAXGpnx1WmDs/dwtJsjEwaQsxSIhyCgiwc3CwcbIJsHFoiIEkAqqJ3a5aRx5UAAAAASUVORK5CYII="
const DOOR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAMAAAANmfvwAAAC/VBMVEUBAAABAwAVAQEFAAAJAQINAQG4bAkCBwmkWgIqEwEIEQEXBwC2bg9zQwRQKAEdAQCCTAsMAQicWQSwZQOVWQJ7QgIGBgJ0RQFcMwEfDAAABwC3bhIyHQ+xaQ20aQm4aAl8RweUUwZXMAV5RwSGSAJ4QwJZMAFOLQEZAwCwahKQUg+gXg3BbwmtaAmpZAhZMgexaQaaWASbVAKXUgEMEgAhEAAlDQClZRRTMxS9cxLAchFfNxAFAxC8bw92RAzDcAuDUwoEAQq9awegWwajXQO4ZgKCSQKmYAASFQAsBgARAQC6dBe6cRbAdxR6OxKoWBB+TQ+XWQubUAlJKwizZwaMUwQKGwQaDAR+SgNoRQNlQANpKQISDQKoXQFPMgEmEAAbCQAfBwC+cCB0TRtmQBi7ZBWRXRO4chJ6QRI6JRGybA5qNA6cXguAQgk5GggPDAiORwVhNgS6cwOMTwNhMAOwXgKiWAJWNgJoNQJGKwKXXQETHAEDFAA3EgADEAA+DQBZPiSqXR6qbhp/RhZZNha9dhVvRRS0ahOMSBNePBNKKxJ5ThGJVBDIdQ9yPw9UKQ8HCg8MAg+xZg6gWA5ySg5pQw2APg1RMA23cQyrawxSTgtpQAtZPgtLLAuASQpfOgotFghOOwfGcgasZAZaTgZuRAV4OwWzYgSWVgRWVQRRXQONSwJARgJaQgJVLQK6bAGXTQFhOgEcDwGsWgByLABfKgAxIQAJDwAOBwAmAwBrbm/FayOPXSKvZSG4aR7CfRxKMhwJCBquaBkmGRbGbhRaJRNRIxN4MxIWBRKSUhFOTg57Rw5WMw60aQ1yOw0aGA3GeAxfQgqmWwmRTQiFQwc7IAUJDAVxOgRUJAQXIgI0GwGgUQB/PgAyLABAJgBIJQAmJABAHAAyFgCdsZB4hIAiKyg6JCGwcx6fYB5NOB5ULRtqLxo0Jhl3RhZZVhNpPhM3NRIVERG1YhBbLw8dCA9EFwlcMwjAbQZKQAIdHAE7SwCKPwBEMwA2LwAmLAAAqN6DAAAETElEQVQ4yz3UdVRTURzA8buxjW0sYCM2YUGNTbYJDCQUkBwdktII0iVICCK2dKdISyhIi2B3d3d3d+vxPkC//9z7x+f83nvn3XPBw0ePUbKyssoyUwHUdMgeoK4k79gBloNyKOZaWSkoKGAwGBkUagYSCoPFYJCtIQoQy+fCKioUkLCTRhmGwTphMcozZJcrE4HvfjjBCvxLBiODLBgsFlnhfHAdEiuZg2pJSWqwVgLBaBzrpxablOvoSFB7dfC9LEo5BywvT/aLLfw4BylyjoZXmFyrSWR8YOC2LwUr9qk5gWRDsMzw+9jSxdyZSM9m3soKZ95ZJ987eFNyMX91fNnnCTlIHG6HMLT1BYLKytMC2q0l4UY6HurSbg67I2N+ilt8GdUB3L7TUtRlE2xGCh6xZuuraDCNKNr6zlKplG7XbdBLbrnxDmzYWF2sVZluGWxwM52dTQ5hMiFxkUoz6APWwer+AW0nwJuNNZrqLt1mbPyInZ6iSkgYQqJtxQZ4OyFOX37B1s1wSqOmrgvHzBxnLYRERy6MwjVQZYlEehxrV5r9gk1bQF9IAFdX1dzM1bWk5D+JI4lIJBzO1MZ+6FcfuDfG00ZItKmlJR0SpzBKs4RFIqlCwhYX8wg5wCG0HxLTtQmKirQGhIRfq60SrDI2XqVq6i324REcwPZQXnPCejPnqKTQ6lUJKpn81sNHVx7wz3Pc9dQVZ6vFIBiC7bNnyeuy9HSLHoQW7EojL75/5KXb8ajG3NwIz+h6W63FkBAhMe6wTWukOjWtTryaFXjUbbVmURnVkafEIuEhIQKiESQuEnseGtt0pqs0prbW7UzWuhcTE5SrotN4rSWh08RZksbgo00slCwsLGJiYrJKjyBTRGxIZhMnH0QjGSgumM08P89eJUAnM94tP/8w1bHGp8F7ksDX1ZDvIQWLtfNyOxN8yJnDhGujK3d35eUVG8d5wy9iGoKg8P7mnrWp5wZHRy8uvEAOkUPPSpSslwQGis3TvW3sGXwHcO8Bj9tjOtDOwePXH7pAbpJDayjR4sSDBhyhnbeNP0J+32fAP23XPpBaj7PEk70QYsNy3rvWXJjOofkzxv6ADZlDmuoLOe3nUlNdv04TXVb0XmecUAjJUFsf2Lw1AJJFhyz19Eyt8eSlU1PiRB1sYQmOxoWH4R/Z6T5/vvuijCmiryrqldCtLc1pmgg50XbeY+aeSVK1x51L4fMp2uqq9J8pdBxb4Hmy5tsPQCTURSSmuH9gCQQHdq+8tI1KvWvhSbcbodc3pNmfXBdpdB3kGF0+VZqYUpWdne3peRyS8LvVUWJ6hq2ij7xFC+VyUA5Yhh2+ofP2tcc8mIeHCoPKXBrROc9HKYrbGVHgRUDDq2PZ+Lhc7D4TE5M1a9aY1NUVYj89WVF4alZ/pI7XiuexfuCsL/BNRoGgs0FOWDQMg0UrVBw75sfnM6lotN9wkDLqiu9fzWtuaqRM1k0AAAAASUVORK5CYII="
const BOOM = "data:image/png;base64,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"
const DESTRUCTIBLE_WALL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAICAgICAQICAgIDAgIDAwYEAwMDAwcFBQQGCAcJCAgHCAgJCg0LCQoMCggICw8LDA0ODg8OCQsQERAOEQ0ODg7/2wBDAQIDAwMDAwcEBAcOCQgJDg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg7/wgARCAAeAB4DAREAAhEBAxEB/8QAGgAAAgIDAAAAAAAAAAAAAAAABgcICQECBf/EABoBAAIDAQEAAAAAAAAAAAAAAAAFAgMGBAH/2gAMAwEAAhADEAAAAHjycvUnPHpXCuW2dNHEU7PZSgl88uZ7zvDrpLcG9lFcUNEy0tmCEDPOqv/EADEQAAAGAQIDBgMJAAAAAAAAAAECAwQFBgcACBESIgkTGDGW0xYZViEyNEFSVFdYlP/aAAgBAQABPwCE2A7YazU2Feu8Xb7Xbo9uRCXmGdreNEXrgPvqkRKpwTAf0hrwO7Ofoy7+uX3u68Duzv6Lu/rp97ut8uHsVYVyvjNhiSMnYZnMQz5xJpS84u/5zpLIlIJe9MPL9hzadbdMgvXTl8534XlZyr1nONUY+1rbnRd0GYpK9z9q3QWOo4xiJ97CRM02jGa7h+5bOTpDzIil0ByFAdeGy9f3vu3pZl7Wst7I464hDzd63W2i9PmHO0Yi8rTUgt01Os/DlIHmKYaCl9oT+5wF6ge+zrG+Gd9+J8ES9Lgn2DHcW6sbywrrPLE8MqCzg5lVCBwQ8uPlrCmV98eeXVl+E6ljSFioV2q0PNWFZ01YvVkljoqEbqAQ3eCUU9WKp76UYVI9kdYQBj3wAmEdNOzH5+A+fFHy4a+apQf4lm/96Ole1RoQtFiBiaa6iCX8cjrC3aOUvFGzqNxjI43mJh+1s0nKi7ReJAjyPHR1ykABHjxKB9O+0spFraBGtsXy7QUz9/znepfl06//xAAmEQABAwIEBgMAAAAAAAAAAAABAAIDBBEFEBKREyExM1LRIjLB/9oACAECAQE/AGQQlgOkbBcCHxGwXAh8RsFV08Wj6gKLtjPF6h1PC0gXufai7YtlZY7oEDdd+v4VEx7GgL5IG45LGad88DQD0Ptf/8QAIxEAAQMCBQUAAAAAAAAAAAAAAQADEQJRBBATMZEFITIzcf/aAAgBAwEBPwClhuNhwFot2HAWi3YcBYxlsNggCZsqds8Z6x9VPjnjp0xF0OwyBkSuoVChoE3X/9k="
const UN_DESTRUCTIBLE_WALL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAAiACIDAREAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAkFBgcIA//EABkBAAMBAQEAAAAAAAAAAAAAAAACBgQBBf/aAAwDAQACEAMQAAAA71xpEaGAzpFUzJyzs6uqrmhgM9RFYR8s7Srqq5oYDPURWkbKMnravP8AR0Gj0XieNlKF6WjzdgBO6/O+J//EADcQAAAEAwMEEQUAAAAAAAAAAAECAwQABQcGCBESVHOyEBMUFRYZIjEzNjdVdpKUobMhIzVCUv/aAAgBAQABPwC1E9fyGbCyYOBatU0U8hIgBgHJjhrO+8FPaOGs77wU9ovG2xnK132pJDP1MBs+8+MYlBsJSy0BNWKgdZVNClq7N4nsBqR4fefGMSj8Sy0BNWLf9ZVdClqwGxeJ7AakeH3nxjEnAN6GOgJqhFdr+dJrA1QnEgfTJ28dsARSVWYIbejlCmBsCmCOMko3nM39CaOMjo3nM39CaLY3zqaVkpXUez0hfukplwZfLEB8gKJT4E5iiPOaJRiEpZcoOgJqwu1RVXWMdFM5srnMUBjcLbN0vIEbhbZul5AjcyKRRyEiEx+g5JQDGJQ1R3qZfZT6En6h/IR//8QAIxEAAgECBQUBAAAAAAAAAAAAAQIAA3EEEBIzURETISMyMf/aAAgBAgEBPwDD0k7S+J204nbTiPTXQfErbjXMw+0ts3+TKu41zMPtLbN/kytuNczDn1LbN/gyqfY1zFYgDoZrbma25gdj+mVCdbXn/8QAHxEAAgIBBQEBAAAAAAAAAAAAAAIBMhEDEBJRcSEx/9oACAEDAQE/AEiOMGDA9ZNS7eiV3esj3b0WsbvWTUu3otSJ2fHGTUu3ort2cm7OTdjO2P0ZpzP0/9k="

const UnDestructibleWallPosition = [
  ...new Array(5).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(15).fill(0).map((_, inIndex) => {
      return [
        inIndex * 2 + 2,
        index * 2 + 2
      ]
    }))
    return acc 
  }, []),
  ...new Array(2).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(33).fill(0).map((_, inIndex) => {
      return [
        inIndex,
        index * 12
      ]
    }))
    return acc 
  }, []),
  ...new Array(2).fill(0).reduce((acc, _, index) => {
    acc.push(...new Array(13).fill(0).map((_, inIndex) => {
      return [
        index * 32,
        inIndex
      ]
    }))
    return acc 
  }, [])
]

const LEVEL_MAP = [
  {
    wall: [
      ...UnDestructibleWallPosition
    ],
    destructibleWall: [
      [2, 3], [3, 3], [4, 3], [5, 3], [1, 3], [10, 5]
    ],
    monster: [
      ['BalloonMonster', 8, 1],
      ['BalloonMonster', 20, 5],
      ['BalloonMonster', 14, 9],
      ['BalloonMonster', 8, 9],
      ['CrossWallMonster', 10, 3],
      ['SpeedMonster', 30, 7]
    ],
    buff: [
      ["SuperBoomBuff", 2, 3],
      ["LoopBuff", 8, 7],
      ["TimeBoomBuff", 20, 3],
    ],
    time: 480 
  }
]