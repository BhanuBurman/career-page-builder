def validate_email_domain(email: str, allowed_domain: str | None = None) -> bool:
    """
    Lightweight email domain validator to illustrate utility usage.
    """
    if "@" not in email:
        return False
    if allowed_domain:
        _, domain = email.rsplit("@", 1)
        return domain.lower() == allowed_domain.lower()
    return True

