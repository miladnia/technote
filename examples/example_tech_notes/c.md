# Array

```c
int scores[3];
int scores[] = {50, 60, 70};
```

```c
float average(int length, int scores[]);
void filter(int height, int width, RGB image[height][width]);
```

# struct

```c
typedef struct
{
    string name;
    string number;
} person;
```

```c
person people[3];
people[0].name = "Milad";
people[0].number = "+1-617-495-1000";
```

> Read more at [kernel.org][typedefs].

# Pointers

```c
int n = 50;
int *p = &n;
```

> `*p` means declare a variable called `p` that's going to point to an integer's location.

```c
printf("%p\n", &n);
printf("%p\n", p);
printf("%i\n", *p);
```

>  `*p` means go to the actual location.

# string

```c
char *s = "HI!";
```

```c
typedef char *string;
string s = "HI!";
```

```c
char *s = "HI!";
printf("%c", *s); // s[0]
printf("%c", *(s + 1)); // s[1]
printf("%c\n", *(s + 2)); // s[2]
```

# malloc, free

```c
char *s = "hi!";
// Allocate one extra byte for NUL character ('\0')
char *t = malloc(strlen(s) + 1);

// Does system ran out of memory?
if (t == NULL)
{
    return 1;
}

strcpy(t, s);
free(t);
```

> Note: Memory address 0 is called the **null pointer**. Your program is never allowed to look at or store anything into memory address 0, so the null pointer is a way of saying "a pointer to nothing". Note that a null pointer is not the same as a null character; do not confuse the two. [#ecu.edu][ecumem]

> Note: The null character is a control character with the value zero. [#wikipedia][nullchar]

```c
int *x = malloc(3 * sizeof(int));
x[0] = 72;
x[1] = 73;
x[2] = 33;
free(x);
```

> Note: Use `valgrind` to detect memory leakages.

```c
int *x;
int *y;

x = malloc(sizeof(int));

*x = 42;
// *y = 13; -> bad idea

y = x;
*y = 13;
```

> Notice: We never assigned `y` a value, which means it's a garbage value, which is still a number. It could be an actual address somewhere in the memory.

![memory](/static/examples_assets/memory.png)
![stack](/static/examples_assets/stack.png)

## File I/O

- Append text:

```c
FILE *file = fopen("notes.csv", "a"); // a: append
char *text = "some text";
fprintf(file, "%s\n", text);
fclose(file);
```

- Print file:

```c
typedef uint8_t BYTE;
FILE *f = fopen("text_file.txt", "rb");
BYTE buffer;
while (fread(&buffer, sizeof(BYTE), 1, f))
{
    printf("%c", buffer);
}
```

---

# Compile

Compile the file `hello.c`:

```shell
clang -ferror-limit=1 -gdwarf-4 -ggdb3 -O0 -std=c11 -Wall -Werror -Wextra -Wno-gnu-folding-constant -Wno-sign-compare -Wno-unused-parameter -Wno-unused-variable -Wno-unused-but-set-variable -Wshadow hello.c -lcrypt -lm -o hello
```

---

[nullchar]: https://en.wikipedia.org/wiki/Null_character
[typedefs]: https://www.kernel.org/doc/html/latest/process/coding-style.html#typedefs
[ecumem]: http://www.cs.ecu.edu/karl/3300/spr14/Notes/C/Memory/memory.html
