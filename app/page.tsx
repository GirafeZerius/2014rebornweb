"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
  timestamp?: string
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "output", content: "2014Reborn Terminal v1.0.0" },
    { type: "output", content: "Welcome to the retro computing experience." },
    { type: "output", content: 'Type "help" for available commands.' },
    { type: "output", content: "" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const keypressAudioRef = useRef<HTMLAudioElement>(null)
  const enterSoundRef = useRef<HTMLAudioElement>(null)

  // Initialize audio and start playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3 // Set volume to 30%
      audioRef.current.loop = true

      // Try to play audio (modern browsers may require user interaction)
      const playAudio = async () => {
        try {
          await audioRef.current?.play()
        } catch (error) {
          console.log("Audio autoplay blocked by browser")
        }
      }

      playAudio()
    }

    // Set up keypress audio
    if (keypressAudioRef.current) {
      keypressAudioRef.current.volume = 0.4 // Good volume for typing sounds
    }

    // Set up enter sound audio
    if (enterSoundRef.current) {
      enterSoundRef.current.volume = 0.5 // Volume for enter sound
    }
  }, [])

  // Play typing sound
  const playTypingSound = () => {
    if (keypressAudioRef.current) {
      keypressAudioRef.current.currentTime = 0 // Reset to start
      keypressAudioRef.current.play().catch(() => {
        console.log("Keypress audio play failed")
      })
    }
  }

  // Play enter sound (cut to 1 second)
  const playEnterSound = () => {
    if (enterSoundRef.current) {
      enterSoundRef.current.currentTime = 0 // Reset to start
      enterSoundRef.current.play().catch(() => {
        console.log("Enter sound play failed")
      })

      // Stop the sound after 1 second
      setTimeout(() => {
        if (enterSoundRef.current) {
          enterSoundRef.current.pause()
          enterSoundRef.current.currentTime = 0
        }
      }, 1000)
    }
  }

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Auto-focus input and scroll to bottom
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const commands = {
    help: () => [
      "Available commands:",
      "  help     - Show this help message",
      "  telegram - Open 2014Reborn Telegram",
      "  discord  - Open 2014Reborn Discord",
      "  docs     - Open project documentation",
      "  alts     - Open the shop for Roblox alts",
      "",
    ],
    telegram: () => {
      window.open("https://t.me/official2014reborn", "_blank")
      return ["Opening 2014Reborn Telegram...", ""]
    },
    discord: () => {
      window.open("https://discord.gg/2014reborn", "_blank")
      return ["Opening 2014Reborn Discord...", ""]
    },
    docs: () => {
      window.open("https://docs.2014reborn.xyz", "_blank")
      return ["Opening 2014Reborn documentation...", ""]
    },
    alts: () => {
      return ["Opened the shop link, buy roblox alts for dirt cheap there.", ""]
    },
  }

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    // Add command to history
    const newHistory: TerminalLine[] = [...history, { type: "command", content: `guest@2014reborn:~$ ${trimmedInput}` }]

    // Parse command and arguments
    const [command, ...args] = trimmedInput.toLowerCase().split(" ")

    // Execute command
    if (commands[command as keyof typeof commands]) {
      const output = commands[command as keyof typeof commands](args)
      output.forEach((line) => {
        newHistory.push({ type: "output", content: line })
      })
    } else {
      newHistory.push({ type: "error", content: `Command not found: ${command}` })
      newHistory.push({ type: "output", content: 'Type "help" for available commands.' })
      newHistory.push({ type: "output", content: "" })
    }

    setHistory(newHistory)
    setCurrentInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      playEnterSound() // Play the enter key sound
      handleCommand(currentInput)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value)
    playTypingSound() // Play sound on each keystroke
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Play typing sound for special keys (but not enter)
    if (e.key === "Backspace" || e.key === "Delete") {
      playTypingSound()
    }
  }

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    // Try to play audio on user interaction if it wasn't playing
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {
        console.log("Audio play failed")
      })
    }
  }

  return (
    <div
      className="min-h-screen bg-black text-green-400 font-mono text-sm p-4 cursor-text overflow-hidden"
      onClick={handleTerminalClick}
    >
      {/* Background Audio */}
      <audio ref={audioRef} src="/audio1.mp3" preload="auto" style={{ display: "none" }} />

      {/* Keypress Audio */}
      <audio ref={keypressAudioRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/key-press-263640-yxXhjlIg2Iv6xqMCOVR9DmvCkWO7DE.mp3" preload="auto" style={{ display: "none" }} />

      {/* Enter Sound Audio */}
      <audio ref={enterSoundRef} src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enter-key_small-keyboard-28395-oGJsPvbH0uzZ4e1arRDmioEzfIPSpT.mp3" preload="auto" style={{ display: "none" }} />

      <div
        ref={terminalRef}
        className="h-screen overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-green-800"
      >
        {/* Terminal Header */}
        <div className="mb-4 border-b border-green-800 pb-2">
          <div className="text-green-300">╔══════════════════════════════════════════════════════════════╗</div>
          <div className="text-green-300">║ 2014REBORN TERMINAL - 2014Reborn Operating System ║</div>
          <div className="text-green-300">╚══════════════════════════════════════════════════════════════╝</div>
        </div>

        {/* Terminal History */}
        <div className="space-y-1">
          {history.map((line, index) => (
            <div
              key={index}
              className={`
              ${line.type === "command" ? "text-green-300" : ""}
              ${line.type === "error" ? "text-red-400" : ""}
              ${line.type === "output" ? "text-green-400" : ""}
              whitespace-pre-wrap break-words
            `}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-green-300 mr-2">guest@2014reborn:~$</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none outline-none text-green-400 font-mono w-full"
              autoComplete="off"
              spellCheck={false}
            />
            <span
              className={`absolute top-0 text-green-400 pointer-events-none ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ left: `${currentInput.length * 0.6}em` }}
            >
              █
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
