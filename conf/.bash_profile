export TERM=xterm-256color
export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8
export EDITOR=vim

### History Handling
export HISTCONTROL=erasedups
export HISTSIZE=10000
shopt -s histappend
bind '"\e[A"':history-search-backward
bind '"\e[B"':history-search-forward

## Web Dev
alias sha384="openssl dgst -sha384 -binary | openssl base64"
sri384() { hash=`curl -s $1 |sha384`; echo sha384-$hash;}
alias icurl="curl -I"
alias spy80="tcpdump -X -s 1024 -i en0 port 80"
alias canhazip="curl -s canhazip.com"
alias jpp="python -m json.tool" #json pretty print
alias md5sum='openssl dgst -md5'
alias md5='md5sum'

## Git
alias gs="git status"
alias gb="git branch"
alias gc="git commit"
alias gr="git checkout"
alias ga="git add"
alias gl="git lola"
alias ghr="git reset --hard origin/master"
alias grho="git reset --hard origin/master"
alias motherfucker="git reset --hard origin/master"
alias gp="git pull"
alias gitcom="git-commander"

## Directories

alias ll="ls -alh"
alias l="ls -alhtr"
alias home="cd ~"
alias github="cd ~/github"
alias ..="cd .."
cd() { builtin cd "$@"; l; }
alias f='open -a Finder ./'
alias temp="cd /tmp/"

### ---------
### Functions
### ---------

_git_prompt() {
    local git_status="`git status -unormal 2>&1`"
    if ! [[ "$git_status" =~ Not\ a\ git\ repo ]]; then
        if [[ "$git_status" =~ nothing\ to\ commit ]]; then
            local ansi=42
        elif [[ "$git_status" =~ nothing\ added\ to\ commit\ but\ untracked\ files\ present ]]; then
            local ansi=43
        else
            local ansi=45
        fi
        if [[ "$git_status" =~ On\ branch\ ([^[:space:]]+) ]]; then
            branch=${BASH_REMATCH[1]}
            test "$branch" != master || branch=' '
        else
            # Detached HEAD.  (branch=HEAD is a faster alternative.)
            branch="(`git describe --all --contains --abbrev=4 HEAD 2> /dev/null ||
                echo HEAD`)"
        fi
        echo -n '\[\e[0;37;'"$ansi"';1m\]'"$branch"'\[\e[0m\] '
    fi
}

_prompt_command() {
   PS1="`_git_prompt`"'\[\e[0;94m\]\u\[\e[97m\]@\[\e[0;94m\]DO.NY\[\e[0m\]:\[\e[0;90m\]\w\[\e[0m\]\$ '
#  PS1="`_git_prompt`"'$ '
}
PROMPT_COMMAND=_prompt_command

###End Git_prompt

checkgzip() { curl -sI -H 'Accept-Encoding: gzip,deflate' $1 |grep Content-Encoding --color; }
