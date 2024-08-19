"use client"

import {useState, useEffect} from "react"

export function useMap<K, V>(data = new Map<K, V>(), logChanges = false) {
    const [map, setMap] = useState({data: data})

    useEffect(() => {
        if (logChanges) {
            console.log(map.data)
        }
    }, [map, logChanges])

    function add(key: K, value: V) {
        const localMap = map.data
        localMap.set(key, value)
        setMap({data: localMap})

        if (logChanges) {
            console.log({
                paramKey: key,
                mapBefore: localMap
            })
        }
    }

    function remove(key: K) {
        const localMap = map.data
        localMap.delete(key)
        setMap({data: localMap})

        if (logChanges) {
            console.log({
                paramKey: key,
                mapBefore: localMap
            })
        }
    }

    return {
        map: map,
        add: add,
        remove: remove,
    }
}