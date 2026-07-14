# Git hooks from GUI apps (Cursor, VS Code, GitHub Desktop) often run with a minimal PATH.

if ! command -v pnpm >/dev/null 2>&1; then
  if [ -n "$APPDATA" ]; then
    export PATH="$APPDATA/npm:$LOCALAPPDATA/pnpm:$PATH"
  fi

  export PATH="$HOME/.local/share/pnpm:$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1090
    . "$HOME/.nvm/nvm.sh" 2>/dev/null || true
  fi

  if command -v fnm >/dev/null 2>&1; then
    eval "$(fnm env --shell sh 2>/dev/null)" || true
  fi
fi
