import React from 'react'
import { useState, useEffect } from "react"
import _ from 'underscore'
import '../App.css'
import queryString from 'query-string'
import { io } from "socket.io-client"
import "../../node_modules/uikit/dist/js/uikit.min.js"
import "../../node_modules/uikit/dist/js/uikit-icons.min.js"
import "../../node_modules/uikit/dist/css/uikit.min.css"

const allTiles = [
    { "red-1a": 1 },
    { "red-1b": 1 },
    { "red-2a": 2 },
    { "red-2b": 2 },
    { "red-3a": 3 },
    { "red-3b": 3 },
    { "red-4a": 4 },
    { "red-4b": 4 },
    { "red-5a": 5 },
    { "red-5b": 5 },
    { "red-6a": 6 },
    { "red-6b": 6 },
    { "red-7a": 7 },
    { "red-7b": 7 },
    { "red-8a": 8 },
    { "red-8b": 8 },
    { "red-9a": 9 },
    { "red-9b": 9 },
    { "red-10a": 10 },
    { "red-10b": 10 },
    { "red-11a": 11 },
    { "red-11b": 11 },
    { "red-12a": 12 },
    { "red-12b": 12 },
    { "red-13a": 13 },
    { "red-13b": 13 },
    { "yellow-1a": 1 },
    { "yellow-1b": 1 },
    { "yellow-2a": 2 },
    { "yellow-2b": 2 },
    { "yellow-3a": 3 },
    { "yellow-3b": 3 },
    { "yellow-4a": 4 },
    { "yellow-4b": 4 },
    { "yellow-5a": 5 },
    { "yellow-5b": 5 },
    { "yellow-6a": 6 },
    { "yellow-6b": 6 },
    { "yellow-7a": 7 },
    { "yellow-7b": 7 },
    { "yellow-8a": 8 },
    { "yellow-8b": 8 },
    { "yellow-9a": 9 },
    { "yellow-9b": 9 },
    { "yellow-10a": 10 },
    { "yellow-10b": 10 },
    { "yellow-11a": 11 },
    { "yellow-11b": 11 },
    { "yellow-12a": 12 },
    { "yellow-12b": 12 },
    { "yellow-13a": 13 },
    { "yellow-13b": 13 },
    { "blue-1a": 1 },
    { "blue-1b": 1 },
    { "blue-2a": 2 },
    { "blue-2b": 2 },
    { "blue-3a": 3 },
    { "blue-3b": 3 },
    { "blue-4a": 4 },
    { "blue-4b": 4 },
    { "blue-5a": 5 },
    { "blue-5b": 5 },
    { "blue-6a": 6 },
    { "blue-6b": 6 },
    { "blue-7a": 7 },
    { "blue-7b": 7 },
    { "blue-8a": 8 },
    { "blue-8b": 8 },
    { "blue-9a": 9 },
    { "blue-9b": 9 },
    { "blue-10a": 10 },
    { "blue-10b": 10 },
    { "blue-11a": 11 },
    { "blue-11b": 11 },
    { "blue-12a": 12 },
    { "blue-12b": 12 },
    { "blue-13a": 13 },
    { "blue-13b": 13 },
    { "black-1a": 1 },
    { "black-1b": 1 },
    { "black-2a": 2 },
    { "black-2b": 2 },
    { "black-3a": 3 },
    { "black-3b": 3 },
    { "black-4a": 4 },
    { "black-4b": 4 },
    { "black-5a": 5 },
    { "black-5b": 5 },
    { "black-6a": 6 },
    { "black-6b": 6 },
    { "black-7a": 7 },
    { "black-7b": 7 },
    { "black-8a": 8 },
    { "black-8b": 8 },
    { "black-9a": 9 },
    { "black-9b": 9 },
    { "black-10a": 10 },
    { "black-10b": 10 },
    { "black-11a": 11 },
    { "black-11b": 11 },
    { "black-12a": 12 },
    { "black-12b": 12 },
    { "black-13a": 13 },
    { "black-13b": 13 },
    { "fake-1": -1 },
    { "fake-2": -2 },
]

var socket;
var myTile;
var tableTile;
var myTableName;
var mySocketName;
var myLeaderName;
var myLeftName;
var myRightName;
var myOppositeName;
var myTurn = false
var tileAllowed = false
var myLeftTileStack = []
const PlayRoom = () => {
    var user;
    var room;

    const drop = (e) => {
        e.preventDefault()

        var data = e.dataTransfer.getData("id")
        var s = document.getElementById(data)
        if (!s) {
            return
        }
        if (s.id === "left" && myTurn) {
            if (tileAllowed && myLeftTileStack.length > 0) {
                if (e.target.id === "middle" || e.target.id === "right") {
                    return
                }

                var tempNumber = e.target.innerHTML
                var tempColor = e.target.style.color
                e.target.innerHTML = s.innerHTML
                e.target.style.color = s.style.color

                myLeftTileStack.pop()
                if (myLeftTileStack.length === 0) {
                    s.innerHTML = "LEFT"
                    s.style.color = "black"
                }
                else {
                    s.innerHTML = myLeftTileStack[myLeftTileStack.length - 1][0]
                    s.style.color = myLeftTileStack[myLeftTileStack.length - 1][1]
                }

                var cell = document.getElementsByClassName("cell2")
                cell["0"].innerHTML = s.innerHTML
                cell["0"].style.color = s.style.color

                socket.emit("myLeftChanged", mySocketName, myLeaderName, s.innerHTML, s.style.color)

                e.target.src = s.src

                tileAllowed = false
            }
            if (myLeftTileStack.length === 0) {
                s.innerHTML = "LEFT"
                s.style.color = "black"
            }
        }
        else if (s.id === "left" && !myTurn) {
            return
        }
        else if (s.id === "middle" && myTurn) {
            if (e.target.id === "left" || e.target.id === "right") {
                return
            }

            if (e.target.innerHTML) {
                return
            }

            if (tileAllowed) {
                var tempNumber = e.target.innerHTML
                var tempColor = e.target.style.color

                socket.emit("requestTableTile", mySocketName, myLeaderName)

                socket.on("getTableTile", (client, leader, tile) => {
                    console.log("getTableTile:", client, leader, tile)
                    console.log("e.target:", e.target)
                    socket.off("getTableTile")

                    let split = tile.split("-")
                    let color = split[0]
                    let number = split[1]

                    e.target.innerHTML = number.substring(0, number.length - 1)
                    if (color === "fake") {
                        e.target.style.color = "green"
                        e.target.innerHTML = "Fake"
                    }
                    else if (color === "red") {
                        e.target.style.color = "red"
                    }
                    else if (color === "yellow") {
                        e.target.style.color = "#d6bc13"
                    }
                    else if (color === "blue") {
                        e.target.style.color = "blue"
                    }
                    else if (color === "black") {
                        e.target.style.color = "black"
                    }

                    e.target.src = s.src
                })

                tileAllowed = false
            }
        }
        else if (s.id === "middle" && !myTurn) {
            return
        }
        else if (s.id === "right") {
            return
        }
        else {
            if (e.target.id === "left" || e.target.id === "middle") {
                return
            }
            else if (e.target.id === "right" && myTurn) {
                if (!tileAllowed) {
                    var cell = document.getElementsByClassName("cell1")
                    cell["0"].innerHTML = s.innerHTML
                    cell["0"].style.color = s.style.color

                    e.target.innerHTML = s.innerHTML
                    e.target.style.color = s.style.color

                    socket.emit("sendToRight", mySocketName, myLeaderName, myLeftName, myRightName, myOppositeName, s.style.color + "-" + s.innerHTML)

                    s.innerHTML = ""
                    s.style.color = ""

                    e.target.src = s.src

                    myTurn = false

                    socket.emit("nextTurn", myRightName)
                    return
                }
                else {
                    return
                }
            }
            else if (e.target.id === "right" && !myTurn) {
                return
            }
            var tempNumber = e.target.innerHTML
            var tempColor = e.target.style.color
            e.target.innerHTML = s.innerHTML
            e.target.style.color = s.style.color
            s.innerHTML = tempNumber
            s.style.color = tempColor

            e.target.src = s.src
        }
    }

    useEffect(() => {
        room = queryString.parse(window.location.search).room
        console.log("room:", room)

        socket = io("/")
        console.log("socket:", socket)

        socket.on("getTile", (mTile, tName, sName, lName, tableMap, okey) => {
            myTile = mTile
            myTableName = tName
            mySocketName = sName
            myLeaderName = lName
            myLeftName = tableMap["left"]
            myRightName = tableMap["right"]
            myOppositeName = tableMap["middle"]

            var okeyTile = document.getElementsByClassName("okeyTile")
            okeyTile["0"].innerHTML = okey[0]
            okeyTile["0"].style.color = okey[1]

            myTile.map((tile, index) => {
                let i = index + 1
                let entry = document.getElementById(i.toString())
                let split = tile.split("-")
                let color = split[0]
                let number = split[1]
                entry.innerHTML = number.substring(0, number.length - 1)
                if (color === "fake") {
                    entry.style.color = "green"
                    entry.innerHTML = "Fake"
                }
                else if (color === "red") {
                    entry.style.color = "red"
                }
                else if (color === "yellow") {
                    entry.style.color = "#d6bc13"
                }
                else if (color === "blue") {
                    entry.style.color = "blue"
                }
                else if (color === "black") {
                    entry.style.color = "black"
                }
            })
        })

        socket.on("leader", (otherClients, room, sName, tableMap) => {
            console.log("I'm leader", otherClients, "...room:", room, "...", "lName:", sName, "...")
            myTableName = "c_table"
            mySocketName = sName
            myLeaderName = sName
            myLeftName = tableMap["2"]["left"]
            myRightName = tableMap["2"]["right"]
            myOppositeName = tableMap["2"]["middle"]
            myTurn = true
            tileAllowed = false

            var a = _.sample(allTiles, 15)
            var b = _.sample(_.without(allTiles, ...a), 14)
            var c = _.sample(_.without(_.without(allTiles, ...a), ...b), 14)
            var d = _.sample(_.without(_.without(_.without(allTiles, ...a), ...b), ...c), 14)
            var other = _.without(_.without(_.without(_.without(allTiles, ...a), ...b), ...c), ...d)
            const a_tile = a.map(e => Object.keys(e)[0])
            const b_tile = b.map(e => Object.keys(e)[0])
            const c_tile = c.map(e => Object.keys(e)[0])
            const d_tile = d.map(e => Object.keys(e)[0])
            tableTile = _.shuffle(other.map(e => Object.keys(e)[0]))

            a_tile.map((tile, index) => {
                let i = index + 1
                let entry = document.getElementById(i.toString())
                let split = tile.split("-")
                let color = split[0]
                let number = split[1]
                entry.innerHTML = number.substring(0, number.length - 1)
                if (color === "fake") {
                    entry.style.color = "green"
                    entry.innerHTML = "Fake"
                }
                else if (color === "red") {
                    entry.style.color = "red"
                }
                else if (color === "yellow") {
                    entry.style.color = "#d6bc13"
                }
                else if (color === "blue") {
                    entry.style.color = "blue"
                }
                else if (color === "black") {
                    entry.style.color = "black"
                }
            })

            var okeyNumber = Math.floor(Math.random() * 13 + 1)
            var colors = ["red", "#d6bc13", "blue", "black"]
            var i = Math.floor(Math.random() * 4)
            var okey = [okeyNumber, colors[i]]
            var okeyTile = document.getElementsByClassName("okeyTile")
            okeyTile["0"].innerHTML = okeyNumber
            okeyTile["0"].style.color = colors[i]

            socket.emit("tilesReady", otherClients, room, [b_tile, c_tile, d_tile], sName, tableMap, okey)
        })

        socket.on("pickTableTile", (client, leader) => {
            var tile = tableTile.shift()

            console.log("pickTableTile", client, leader, tile)
            socket.emit("sendTableTile", client, leader, tile)
        })

        socket.on("sendRight", (client, leader, left, right, middle, tile) => {
            var color = tile.split("-")[0]
            var number = tile.split("-")[1]
            if (mySocketName === client) {
                var cell = document.getElementsByClassName("cell1")
                cell["0"].innerHTML = number
                cell["0"].style.color = color

                var entry = document.getElementById("right")
                entry.innerHTML = number
                entry.style.color = color
            }
            else if (mySocketName === left) {
                var cell = document.getElementsByClassName("cell0")
                console.log("cell", cell)
                cell["0"].innerHTML = number
                cell["0"].style.color = color
            }
            else if (mySocketName === right) {
                var cell = document.getElementsByClassName("cell2")
                console.log("cell", cell)
                cell["0"].innerHTML = number
                cell["0"].style.color = color

                myLeftTileStack.push([number, color])

                var entry = document.getElementById("left")
                entry.innerHTML = number
                entry.style.color = color
            }
            else if (mySocketName === middle) {
                var cell = document.getElementsByClassName("cell3")
                console.log("cell", cell)
                cell["0"].innerHTML = number
                cell["0"].style.color = color
            }
        })

        socket.on("myTurn", () => {
            myTurn = true
            tileAllowed = true
        })

        socket.on("leftChanged", (client, number, color) => {
            if (client === myLeftName) {
                var cell = document.getElementsByClassName("cell3")
                cell["0"].innerHTML = number
                cell["0"].style.color = color
            }
            else if (client === myRightName) {
                var cell = document.getElementsByClassName("cell1")
                cell["0"].innerHTML = number
                cell["0"].style.color = color
            }
            else if (client === myOppositeName) {
                var cell = document.getElementsByClassName("cell0")
                cell["0"].innerHTML = number
                cell["0"].style.color = color
            }
        })

        console.log("1) user: " + user + ", roomID: " + room)
    }, [])

    return (
        <body class="uk-background-muted">
            <div class="uk-container">
                <header class="uk-section-xsmall uk-section-default samd-border" style={{ borderRadius: "0 0 10px 10px;" }}>
                    <div class="uk-container">
                        <h1 class="uk-text-center">samd</h1>
                    </div>
                </header>
                <nav class="uk-background-transparent uk-padding-small">
                    <div class="uk-container uk-flex uk-flex-center uk-flex-middle">
                        <ul class="uk-subnav uk-subnav-divider" uk-switcher="connect: #pages" uk-margin>
                            <li><a>Home</a></li>
                            <li><a>About</a></li>
                            <li><a>Blog</a></li>
                            <li><a>Okey</a></li>
                            <li><a>Drawing Board</a></li>
                        </ul>
                    </div>
                </nav>
                <main class="uk-background-default samd-border" uk-height-viewport="expand: true;" style={{ borderRadius: "10px;" }}>
                    <div class="uk-padding">
                        <ul class="uk-switcher" id="pages">
                            <li class="uk-animation-fade">
                                <h2>Hello, there.</h2>
                            </li>
                            <li class="uk-animation-fade">
                                <h2>About</h2>
                                <p>Praesent turpis est, vestibulum at blandit at, sodales id lorem. Morbi hendrerit diam et vulputate vehicula. Aenean sollicitudin at enim nec dignissim. Ut mi tellus, consectetur at aliquet gravida, egestas at neque. Curabitur bibendum dui metus, quis egestas turpis tincidunt vitae. Donec vulputate dapibus justo, non facilisis felis bibendum non. Mauris non velit leo. Fusce maximus, tortor at aliquam rutrum, ante metus blandit enim, sed congue arcu tellus suscipit nunc. Donec sed rhoncus ipsum. Donec luctus ac ex in cursus. Curabitur malesuada id metus sit amet interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vitae sem in lectus suscipit blandit.</p>
                                <p>Duis pellentesque dolor vitae nisi pulvinar consequat. Pellentesque at velit ac quam fermentum ultricies et eu elit. Suspendisse faucibus auctor metus a sollicitudin. Vestibulum maximus interdum ipsum sed mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc suscipit id augue eu auctor. Sed eget libero rhoncus, hendrerit risus non, semper quam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean eu turpis et augue interdum gravida quis mattis leo. Proin ut rutrum diam. Proin fringilla, nulla vel consectetur sodales, augue nisl fermentum massa, ut dictum orci justo sit amet massa. Ut vel leo tincidunt, consequat eros non, mollis augue. Phasellus non libero consequat, consectetur elit sit amet, ultricies nisl. Nulla facilisi. Vivamus malesuada est at augue congue, eget molestie arcu pulvinar.</p>
                            </li>
                            <li class="uk-animation-fade">
                                <h2>Blog</h2>
                                <article>
                                    <h3 class="uk-margin-small"><a class="uk-link-reset" href="">Aliquam sodales dolor id vehicula aliquet</a></h3>
                                    <p class="uk-text-meta uk-margin-remove">12 April 2012</p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                                    <div class="uk-grid-small uk-child-width-auto" uk-grid>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">Read more</a>
                                        </div>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">5 Comments</a>
                                        </div>
                                    </div>

                                </article>
                                <hr class="uk-divider-icon" />
                                <article>
                                    <h3 class="uk-margin-small"><a class="uk-link-reset" href="">Aliquam sodales dolor id vehicula aliquet</a></h3>
                                    <p class="uk-text-meta uk-margin-remove">12 April 2012</p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                                    <div class="uk-grid-small uk-child-width-auto" uk-grid>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">Read more</a>
                                        </div>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">5 Comments</a>
                                        </div>
                                    </div>

                                </article>
                                <hr class="uk-divider-icon" />
                                <article>
                                    <h3 class="uk-margin-small"><a class="uk-link-reset" href="">Aliquam sodales dolor id vehicula aliquet</a></h3>
                                    <p class="uk-text-meta uk-margin-remove">12 April 2012</p>

                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                                    <div class="uk-grid-small uk-child-width-auto" uk-grid>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">Read more</a>
                                        </div>
                                        <div>
                                            <a class="uk-button uk-button-text" href="#">5 Comments</a>
                                        </div>
                                    </div>

                                </article>
                            </li>
                            <li class="uk-animation-fade">
                                <h2>Okey</h2>
                                <ul class="uk-list uk-list-divider">
                                    <li>
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Your Room
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                0/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-primary uk-width-small">Create</button>
                                            </div>
                                        </div>
                                    </li>
                                    <li uk-scrollspy="cls:uk-animation-fade">
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Room 1
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                1/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-danger uk-width-small">Join</button>
                                            </div>
                                        </div>
                                    </li>
                                    <li uk-scrollspy="cls:uk-animation-fade">
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Room 1
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                1/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-danger uk-width-small">Join</button>
                                            </div>
                                        </div>
                                    </li>
                                    <li uk-scrollspy="cls:uk-animation-fade">
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Room 1
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                1/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-danger uk-width-small">Join</button>
                                            </div>
                                        </div>
                                    </li>
                                    <li uk-scrollspy="cls:uk-animation-fade">
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Room 1
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                1/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-danger uk-width-small">Join</button>
                                            </div>
                                        </div>
                                    </li>                <li uk-scrollspy="cls:uk-animation-fade">
                                        <div class="uk-grid uk-flex uk-flex-middle">
                                            <div class="uk-text-lead">
                                                Room 1
                                    </div>
                                            <div class="uk-width-expand">
                                            </div>
                                            <div class="uk-text-lead">
                                                1/4
                                    </div>
                                            <div>
                                                <button class="uk-button uk-button-danger uk-width-small">Join</button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>

                                <div>Total Players: <span class="uk-label uk-label-warning">12431</span></div>
                            </li>
                            <li class="uk-animation-fade">
                                <h2>Drawing Board</h2>
                            </li>
                        </ul>
                    </div>
                </main>
                <footer class="uk-background-transparent uk-padding-small">
                    <div class="uk-container">
                        <p class="uk-text-meta uk-text-center">Copyright &copy; 2021 samd</p>
                    </div>
                </footer>
            </div>

            <input type="submit" value="I'm ready" onClick={() => socket.emit("imready", { user, room })} />

            <div className="okeyTable">

                <div className="cell0" style={{ color: "black" }}></div>
                <div className="cell1" style={{ color: "black" }}></div>
                <div className="cell2" style={{ color: "black" }}></div>
                <div className="cell3" style={{ color: "black" }}></div>

                <div className="okeyTile" style={{ color: "red" }}></div>

                <div className="rectangleA"></div>
                <div className="rectangleB"></div>
                <div className="rectangleC"></div>

                <table className="myTable" onDrop={drop} onDragOver={(e) => e.stopPropagation()}>
                    <thead key="thead">
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                            <th>13</th>
                            <th>14</th>
                        </tr>
                    </thead>
                    <tbody key={"d"}>
                        <tr className="gamePlay">
                            <td
                                id="left"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                                colSpan="4"
                                style={{ textAlign: "center" }}
                            >
                                LEFT
                            </td>
                            <td
                                id="middle"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                                colSpan="6"
                                style={{ textAlign: "center" }}
                            >
                                MIDDLE
                            </td>
                            <td
                                id="right"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                                colSpan="4"
                                style={{ textAlign: "center" }}
                            >
                                RIGHT
                            </td>
                        </tr>
                        <tr>
                            <td
                                id="1"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="2"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="3"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="4"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="5"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="6"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="7"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="8"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="9"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="10"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="11"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="12"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="13"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="14"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                        </tr>
                        <tr>
                            <td
                                id="15"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="16"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="17"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="18"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="19"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="20"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="21"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="22"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="23"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="24"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="25"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="26"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="27"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                            <td
                                id="28"
                                draggable={true}
                                onDragStart={(e) => e.dataTransfer.setData("id", e.target.id)}
                                onDragOver={(e) => e.preventDefault()}
                            />
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
    )
}

export default PlayRoom
